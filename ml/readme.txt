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

Download pickled model from
https://drive.google.com/file/d/1jfSYI8yT_RsMPobFHpa5H-oaRiqtIWJ3/view?usp=sharing
and put in output/model_final.pth

To setup:
pip3 install -r requirements.txt