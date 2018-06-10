%rect 11.41
%cont 29.58
%dense 58.86
clear all;
annot_type = 3;
base_dir = '/vision/vision_users/suyog/cvpr16_danna/journal_paper/'
if(annot_type == 1)
    label = 'rectangle';
elseif(annot_type == 2)
    label = 'contour';
else
    label = 'dense';
end

out_dir = [base_dir 'mturk_data/' label '/'];
image_dir = [base_dir 'images/'];

system(['mkdir -p ' out_dir]);

alpha = 0.5;
offset_pts = 15;

se = strel('disk',5);
%num_per_hit = 5;

res_file = [base_dir label '.results'];
fid = fopen(res_file);
res_data=textscan(fid,'%s','delimiter','\n');
fclose(fid);

res_data = res_data{1};
header_data = res_data{1};
pat = '\t+';

tokens = regexp(header_data, pat, 'split');    
result_idx = strfind(tokens,'Answer.results');
result_idx = find(not(cellfun('isempty', result_idx)));
annot_idx = strfind(tokens,'workerid');
annot_idx = find(not(cellfun('isempty', annot_idx)));

res_data = res_data(2:end);
num_hits = length(res_data);
hit_count = 1;
show_results = 0;
time_data = [];
for ind = 1:num_hits
    str = res_data{ind};
    pat = '\t+';
    tokens = regexp(str, pat, 'split');   
    result_str = tokens{result_idx};
    worker_id = tokens{annot_idx};
    tokens_id = strfind(result_str,'img');
    tokens_id = [tokens_id length(result_str)];
   
    im_data = cell(1,1);
    im_count = 1;
    disp(ind);
    
    for k=1:length(tokens_id)-1
        temp = result_str(tokens_id(k):tokens_id(k+1)-1);                              
        tokens_names = {'img','type','clicks','time','breakpoints'};
        start_ids = [];
        for k1 = 1:length(tokens_names)            
            start_ids = [start_ids regexp(temp,tokens_names{k1},'start')];   
        end
       
	start_ids = [start_ids length(temp)+1];         
        im_data{im_count} = struct;
        for k1=1:length(tokens_names)
            t_str = temp(start_ids(k1):start_ids(k1+1)-2);            
            t_str = regexp(t_str,',+','split');   
            if(k1 ~= 1)
                if(length(t_str) == 1)
                    num_mat =[];
                else
                    aa = t_str(2:end);
                    num_mat=str2num([sprintf('%s ',aa{1:end-1}),aa{end}]);
                end
                im_data{im_count} = setfield(im_data{im_count},t_str{1},num_mat);
            else
                im_data{im_count} = setfield(im_data{im_count},t_str{1},cell2mat(t_str(2:end)));
            end            
        end  
        im_count = im_count+1;
    end
    
    num_img = length(im_data); 
    for k=1:num_img
        if(isempty(im_data{k}))
            im_data{k} = struct;
            im_data{k} = setfield(im_data{k},'img','not_labeled.png');
            im_data{k} = setfield(im_data{k},'type',annot_type);
            im_data{k} = setfield(im_data{k},'clicks',[]);
            im_data{k} = setfield(im_data{k},'time',-1);
            im_data{k} = setfield(im_data{k},'breakpoints',0);
            im_data{k} = setfield(im_data{k},'oscore',0);
	    continue;
        end	
	time_data = [time_data ; im_data{k}.time];


	fpath = [image_dir im_data{k}.img];
	out_path = [out_dir im_data{k}.img];
        
	img = imread(fpath);
        r = size(img,1);
        c = size(img,2);               
        out_mask = zeros(size(img,1),size(img,2));               
        point_mask = zeros(size(img,1),size(img,2));               
        
	if im_data{k}.time == -1
		im_data{k}.mask = logical(out_mask);
		im_data{k}.point_mask = logical(point_mask);
		continue;
	end
	
	
	if(length(im_data{k}.clicks)>0)
            im_data{k}.clicks = im_data{k}.clicks-offset_pts;
        end
        
	if(annot_type == 1)            
            pts = im_data{k}.clicks;
            pts(find(pts<=0)) = 1;
            for j=1:4:length(pts)
                xval = min([pts(j) pts(j+2)]);
                yval = min([pts(j+1) pts(j+3)]);

                xval = min(xval,c);
                yval = min(yval,r);

                rw = abs(pts(j)- pts(j+2));
                rh = abs(pts(j+1)- pts(j+3));                           
                out_mask(yval:min(yval+rh,r),xval:min(xval+rw,c)) = 1;                                
            end
        
       elseif(annot_type == 2)           
            pts = im_data{k}.clicks;
	    pts = ceil(pts);
            pts(isnan(pts)) = 0;
	    pts(find(pts<=0)) = 1;
            pts = reshape(pts,2,length(pts)/2)';
            pts(find(pts(:,1)>size(img,2)),1) = size(img,2);
            pts(find(pts(:,2)>size(img,1)),2) = size(img,1);  
           
	    break_points = im_data{k}.breakpoints;
            break_points = break_points(find(break_points~=0));
            if(length(pts)>0)
                break_points = [0 break_points(find(break_points~=0)) length(pts)];
            end 
	   
            %out_mask = poly2mask(pts(:,1),pts(:,2),r,c);                        
            for k1=1:length(break_points)-1
                st_ind = break_points(k1)+1;
                end_ind = break_points(k1+1);                    
		if (end_ind-st_ind<=1)
			continue;
		end
                out_mask_t = poly2mask(pts(st_ind:end_ind,1),pts(st_ind:end_ind,2),r,c);                        
		out_mask = (out_mask | out_mask_t);                    
            end
	   
	    point_idx = sub2ind([r c],pts(:,2),pts(:,1));
	    point_mask(point_idx) = 1;
            %out_mask = poly2mask(pts(:,1),pts(:,2),r,c);                        

        elseif(annot_type == 3)           
            pts = im_data{k}.clicks;
            pts(find(pts<=0)) = 1;
	    pts(find(isnan(pts) == 1)) = 1;
            pts = reshape(pts,2,length(pts)/2)';
            pts(find(pts(:,1)>size(img,2)),1) = size(img,2);
            pts(find(pts(:,2)>size(img,1)),2) = size(img,1);                        

            break_points = im_data{k}.breakpoints;
            break_points = break_points(find(break_points~=0));
            if(length(pts)>0)
                break_points = [0 break_points(find(break_points~=0)) length(pts)];
            end

            for k1=1:length(break_points)-1
                st_ind = break_points(k1)+1;
                end_ind = break_points(k1+1);                    
                out_mask_t = poly2mask(pts(st_ind:end_ind,1),pts(st_ind:end_ind,2),r,c);                        
                out_mask = (out_mask | out_mask_t);                    
            end
	   
	    point_idx = sub2ind([r c],pts(:,2),pts(:,1));
	    point_mask(point_idx) = 1;
        end

	im_data{k}.mask = out_mask;
	im_data{k}.point_mask = logical(point_mask);
	im_data{k}.worker_id = worker_id;
       
        if(show_results == 1)
		out_img = blend_mask(img,out_mask,[0 1 0], 0.7);
		point_mask = imdilate(point_mask,se);
		point_img = blend_mask(img,point_mask,[1 0 1], 0.5);
		if ndims(img) == 2
			img = repmat(img,[1 1 3]);
		end
		out_img = [im2double(img) point_img out_img];

            	%imwrite(out_img,out_path);
		%imwrite(out_mask,imoutname); 
            	imshow(out_img);
		title(im_data{k}.img);
		pause;           
		%pause(0.2);
        end
    end   
    
    annot_results{hit_count} = im_data;
    hit_count = hit_count + 1;
end


hit_count = length(annot_results);
%num_assignments = 10;
num_assignments = 3;
mat_dir = [base_dir 'mturk_data/' label '/mat_files/'];
viz_dir = [base_dir 'mturk_data/' label '/viz_files/'];
system(['mkdir -p ' mat_dir]);
system(['mkdir -p ' viz_dir]);

for i=1:num_assignments:hit_count
	for j=i:i+num_assignments-1
		im_data = annot_results{j};
		if length(im_data)<5
			disp(i);

			pause;
		end
		for k=1:length(im_data)
			img_name = im_data{k}.img;
			im_prefix = img_name(1:end-4);
			mat_file = [mat_dir im_prefix '_user_' num2str(j-i+1) '.mat'];
			%mat_file = [mat_dir im_prefix '_user_' num2str(j-i+1+5) '.mat'];
			viz_file = [viz_dir im_prefix '_user_' num2str(j-i+1) '.png'];
			%viz_file = [viz_dir im_prefix '_user_' num2str(j-i+1+5) '.png'];
			annotation = im_data{k};
			disp(im_prefix);
			save(mat_file,'annotation');
			
			fpath = [image_dir im_data{k}.img];

			if exist(fpath,'file')
				img = imread(fpath);
				r = size(img,1);
				c = size(img,2);               
				
				out_img = blend_mask(img,annotation.mask,[0 1 0], 0.7);
				point_mask = imdilate(annotation.point_mask,se);
				point_img = blend_mask(img,point_mask,[1 0 1], 0.5);
				if ndims(img) == 2
					img = repmat(img,[1 1 3]);
				end
				viz_img = [im2double(img) point_img out_img];
				imwrite(viz_img,viz_file);
			end
			
		end
	end
end

%save(out_file,'annot_results','annot_ids');
