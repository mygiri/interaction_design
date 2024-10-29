# This DockerFile is just used for testing and developement purposes 

FROM python:3.8

# Set the working directory in the container
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && apt-get -y install cmake libeigen3-dev

# Install virtualenv
RUN pip install virtualenv

# Copy requirements.txt before installing dependencies
COPY requirements.txt /app/

# Create a virtual environment and install dependencies
RUN virtualenv venv && \
    . /app/venv/bin/activate && \
    pip install git+https://github.com/yuki-koyama/sequential-line-search && \
    pip install -r requirements.txt

# Copy the rest of the application code to the working directory
COPY . /app

# Debugging step: List the contents of the /app directory after copying the application code
RUN ls -l /app

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=api.py
ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Run the Flask application within the virtual environment
CMD ["/bin/bash", "-c", ". /app/venv/bin/activate && flask run --host=0.0.0.0 --port=5000"]
