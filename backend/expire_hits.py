import sys
import os
base_dir = '/home/suyog/mechanical_turk/aws-mturk-clt-1.3.1/'
annot_type = sys.argv[1]
current_dir= base_dir + '/samples/video-annotation/mturk_annotation/'
label = current_dir + annot_type
successfile = label + '.success'
print 'deleting hits for annotation :' + annot_type
os.chdir('../../bin')
cmd = base_dir + 'bin/deleteHITs.sh $1 $2 $3 $4 $5 $6 $7 $8 $9 -successfile ' + successfile + ' -expire'
os.system(cmd)

