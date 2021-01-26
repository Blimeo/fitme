FROM ubuntu:latest
RUN apt-get update -y
RUN apt install -y git
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN apt-get update && apt-get install -y --no-install-recommends software-properties-common \
    libsm6 libxext6 libxrender-dev curl \
    && rm -rf /var/lib/apt/lists/*
RUN add-apt-repository ppa:deadsnakes/ppa 
RUN apt-get install -y build-essential python3.8 python3.8-dev python3-pip 
RUN curl -O https://bootstrap.pypa.io/get-pip.py 
RUN python3.8 get-pip.py 
RUN rm -rf /var/lib/apt/lists/
COPY . .
RUN python3.8 -m pip install torch==1.7.0+cpu torchvision==0.8.1+cpu -f https://download.pytorch.org/whl/torch_stable.html
RUN pip3.8 install -r requirements.txt
ENTRYPOINT ["python3.8"]
CMD ["api.py"]