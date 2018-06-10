%rect 11.41
%cont 29.58
%dense 58.86
clear all;
annot_type = 3;
%base_dir = '/vision/vision_users/suyog/cvpr16_danna/active_segmentation/iccv13_code/mturk/pull_the_plug/BU-BIL-Fluorescence/';
%base_dir = '/vision/vision_users/suyog/cvpr16_danna/active_segmentation/iccv13_code/mturk/pull_the_plug/BU-BIL-PhaseContrast/';
%base_dir = '/vision/vision_users/suyog/cvpr16_danna/active_segmentation/iccv13_code/mturk/pull_the_plug/InteractiveImageSegmentation/';
%base_dir = '/vision/vision_users/suyog/cvpr16_danna/active_segmentation/iccv13_code/mturk/pull_the_plug/Weizmann/';

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

%num_assignments = 10;
num_assignments = 3;
mat_dir = [base_dir 'mturk_data/' label '/mat_files/'];
viz_dir = [base_dir 'mturk_data/' label '/viz_files/'];

mat_files = dir([mat_dir '*.mat']);

pat = '\_';
for i=1:length(mat_files)
    	tokens = regexp(mat_files(i).name, pat, 'split');   
	im_prefix{i} = str2num(tokens{1});
end

uniq_img_ids = unique(cell2mat(im_prefix));

for i=1:length(uniq_img_ids)
	for j=1:3
		mat_file = sprintf('%s/%04d_user_%d.mat',mat_dir,uniq_img_ids(i),j);
		if ~exist(mat_file)
			disp(mat_file);
			prev_mat_file = sprintf('%s/%04d_user_%d.mat',mat_dir,uniq_img_ids(i),j-1);
			load(prev_mat_file);
			annotation.clicks = [];
			annotation.time = -1;
			annotation.mask = 0*annotation.mask;
			annotation.point_mask = 0*annotation.point_mask;
			annotation.worker_id = [];
			disp(annotation);
			save(mat_file,'annotation');
			
		end
	end
end

