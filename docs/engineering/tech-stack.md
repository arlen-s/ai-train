# Technical Stack

## Recommended V2 Stack

Frontend:

- React or Next.js
- TypeScript
- chart library for metrics and distributions

Backend:

- FastAPI
- Python
- Pydantic schemas
- SQLAlchemy or equivalent ORM

Data:

- PostgreSQL for structured metadata
- local object storage or filesystem for sample artifacts
- DVC for dataset versioning

ML and CV:

- PyTorch
- Ultralytics YOLO for detection/segmentation baseline
- OpenCV for cleaning and augmentation
- MLflow for experiment tracking

RL:

- Gymnasium for custom environment interface
- Stable-Baselines3 for PPO baseline
- NumPy for map/state operations
- optional Three.js-compatible replay export for the web viewer

Evaluation:

- scikit-learn or custom metrics where appropriate
- Pandas for reports
- matplotlib/plotly for generated charts

Testing:

- pytest
- API test client
- frontend test runner when frontend is added

## Selection Rationale

The stack prioritizes:

- fast local iteration
- strong AI/ML ecosystem support
- easy documentation and reproducibility
- portfolio readability
- compatibility with later ROS or deployment expansion

## V2 Required Technology Additions

- ONNX Runtime for exported model inference
- richer synthetic augmentation library
- richer scenario generator
- Three.js or React Three Fiber for 3D episode replay

## V3 Technology Candidates

- ROS 2
- Gazebo or Isaac Sim
- TensorRT
- real sensor data ingestion tools
