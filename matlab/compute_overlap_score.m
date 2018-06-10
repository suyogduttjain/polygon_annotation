function overlap_score = compute_overlap_score(predicted_label_img, gt_label_img)
    intersect_score = sum(predicted_label_img & gt_label_img);
    union_score = sum(predicted_label_img | gt_label_img);
    overlap_score = 100*intersect_score/union_score;
end
