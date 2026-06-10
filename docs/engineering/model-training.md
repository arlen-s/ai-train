# Perception Model Training

## Tasks

V2 trains or records workflows for:

- obstacle detection
- lawn/boundary/forbidden-zone segmentation

## Training Records

Each training run must record:

- run id
- dataset version
- model type
- training config
- hyperparameters
- metrics
- artifact path
- known limitations

## Baseline Strategy

Start with:

- detection baseline
- segmentation baseline
- evaluation report
- Badcase classification

Then create at least one improved iteration using:

- data augmentation
- targeted data addition
- label correction
- hyperparameter adjustment

## Metrics

Detection:

- precision
- recall
- F1
- mAP
- false positive rate
- false negative rate

Segmentation:

- IoU
- mean IoU
- boundary deviation
- forbidden-zone error

Operational metrics:

- ONNX export status
- inference latency benchmark
- model size
- scenario-specific weakness

## Badcase Categories

- small object miss
- shadow/glare confusion
- partial occlusion
- boundary ambiguity
- wet grass reflection
- visually similar obstacle
- rare scenario underrepresented

## Promotion Rule

A model version can be considered better only if it improves the target metric without creating unacceptable regressions in critical safety-related scenarios.
