import sys
import os
base_dir = '/projects/suyog/mechanical_turk/aws-mturk-clt-1.3.1/'
annot_type = sys.argv[1]
current_dir = os.getcwd() +'/'
label = current_dir + annot_type
successfile = label + '.success'
outputfile = label + '.results'
print 'getting results for annotation :' + annot_type
os.chdir('../../bin')
cmd = base_dir + 'bin/getResults.sh $1 $2 $3 $4 $5 $6 $7 $8 $9 -successfile ' + successfile +' -outputfile '+ outputfile
os.system(cmd)

