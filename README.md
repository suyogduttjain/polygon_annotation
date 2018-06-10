# Foreground object annotation

This tool was authored by Suyog Dutt Jain and should be used only for academic purposes.

This tool was designed to collect bounding box, sloppy contour and polygon annotations for foreground objects in images.

You need to host this code on a public web server. The code uses parameters passed through the URL to generate the
mechanical turk task.

This tool can be integrated as an external question inside mechanical turk question file.

```sh
Example URL format to use for annotation:
http://www.cs.utexas.edu/~suyog/msra_mturk/mturk_label.html?hit_params=3,object,0001.jpg,183,400,0002.jpg,400,400,0003.jpg,400,267,0004.jpg,267,400,0005.jpg,320,400
```

The above example demonstratese the URL. Here are the details:
3 is a parameter in the url which defines that the system should use polygons. 
2: rough outlines/sloppy contour
1: bounding box

second parameter, just leave it to "object",
after that it is <image>,<image_height>,<image_width> ....

The number of <image>,<image_height>,<image_width> triplets will define the number of images which the annotator will
see within a specifi HIT.

Note: Please use the actual image_height and image_width in the URL because the clicks are recorded relative to that.

After the HIT is submitted:

After downloading this code:
- interface has folder with the html/javascript code

- backend has the things you need to setup for amazon mechanical turk: step.txt has some more instructions. Some sample
files used in our own experiments have been included for reference.

- matlab; refer extract_masks.m to extract information from the response received through Mechanical Turk

Please cite the following papers if you use this tool:

```sh
@InProceedings{Dutt_2013_ICCV,
author = {Suyog Dutt Jain and Kristen Grauman},
title = {Predicting Sufficient Annotation Strength for Interactive Foreground Segmentation},
journal = {The IEEE International Conference on Computer Vision (ICCV)},
month = {December},
year = {2013}
}
```

```sh
@article{Gurari2016PullTP,
title={Pull the Plug? Predicting If Computers or Humans Should Segment Images},
author={Danna Gurari and Suyog Dutt Jain and Margrit Betke and Kristen Grauman},
journal={2016 IEEE Conference on Computer Vision and Pattern Recognition (CVPR)},
year={2016},
pages={382-391}
}
```
