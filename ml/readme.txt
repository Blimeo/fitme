Download train.zip and test.zip
https://drive.google.com/drive/folders/125F48fsMBz2EF0Cpqk6aaHet5VH399Ok

Unzip train to /data/train and test to /data/test
with password 2019Deepfashion2**
So final directory structure should look something like
/data
  /train
    /annos
    /image
  /test
    /test
    /json_for_test

(Honestly we probably don't need to worry about test data)
    

To setup:
python3 -m venv ml-env
source ml-env/bin/activate
python3 -m pip install -r requirements.txt

Then get in and out of virtualenv with 
source ml-env/bin/activate
and
deactivate
, respectively.