# Use Ollama base image
FROM ollama/ollama:latest

# Set environment variable for Ollama model path
ENV OLLAMA_MODEL_PATH=/models

# Set working directory to /app
WORKDIR /app

# Expose port 11434 for Ollama API
EXPOSE 11434

# Install necessary packages
RUN apt-get update && apt-get install -y curl dos2unix && rm -rf /var/lib/apt/lists/*
# Create volume to persist models
# VOLUME ["/models"]

RUN apt-get update && apt-get install -y intel-opencl-icd

# # Copy entrypoint script and set execute permissions
# COPY llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M.gguf /usr/local/bin/llama-3.2-Korean-Bllossom-3B-gguf-Q4_K_M.gguf
# COPY Bllossom_Modelfile /usr/local/bin/Modelfile

# RUN ollama run gemma3
# Use entrypoint.sh as the entry point
# ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]