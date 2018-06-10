import sys
import os
base_dir = '/projects/suyog/annotation/aws-mturk-clt-1.3.1/'
annot_type = sys.argv[1]
current_dir= base_dir + '/samples/video-annotation/mturk_annotation/'
label = current_dir + annot_type
inputf = label +'.input'
question = label +'.question'
successfile = label + '.success'
properties = label +'.properties'
print 'generating HITs for annotation :' + annot_type
os.chdir('../../../bin')
cmd = base_dir + 'bin/updateHITs.sh -success ' + successfile +' -properties ' + properties
os.system(cmd)

