import sys
import os
base_dir = '/projects/suyog/mechanical_turk/aws-mturk-clt-1.3.1/'
annot_type = sys.argv[1]
current_dir = os.getcwd() +'/'
label = current_dir + annot_type
approvefile = label + '.approve'
successfile = label + '.success'
print 'approving results for annotation :' + annot_type
os.chdir('../../bin')
#cmd = base_dir + 'bin/approveWork.sh $1 $2 $3 $4 $5 $6 $7 $8 $9 -approvefile ' + approvefile
cmd = base_dir + 'bin/approveWork.sh $1 $2 $3 $4 $5 $6 $7 $8 $9 -successfile ' + successfile
os.system(cmd)

