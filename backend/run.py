import sys
import os
base_dir = '/projects/suyog/mechanical_turk/aws-mturk-clt-1.3.1/'
annot_type = sys.argv[1]
current_dir = os.getcwd() +'/'
label = current_dir +annot_type
inputf = label +'.input'
question = label +'.question'
properties = label +'.properties'
print 'generating HITs for annotation :' + annot_type
os.chdir('../../bin')
cmd = base_dir + 'bin/loadHITs.sh -label ' + label +' -input ' + inputf +' -question ' +question +' -properties ' + properties
print cmd
os.system(cmd)

