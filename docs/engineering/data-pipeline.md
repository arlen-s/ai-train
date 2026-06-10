# Data Pipeline

## Purpose

Create a reproducible data workflow for lawn mowing robot perception and evaluation.

## Scenario Dimensions

V2 base dimensions:

- grass type
- grass height
- dry/wet state
- flat/slope terrain
- boundary type
- obstacle type
- lighting
- weather
- season/time

V2 sensor and dynamic dimensions:

- LiDAR availability
- ultrasonic availability
- IMU/GNSS availability
- vibration/current log availability
- dynamic obstacle pattern

V3 reserved dimensions:

- rosbag or MCAP source id
- real robot id
- real sensor calibration version
- fleet upload batch id

## Data Lifecycle

```text
ingest -> metadata extraction -> cleaning -> scenario classification -> annotation/QC -> dataset version -> training/evaluation
```

## Cleaning Rules

The pipeline should flag or remove:

- duplicate samples
- blurry images
- overexposed/underexposed samples
- broken files
- missing metadata
- invalid annotation files
- impossible scenario labels

## Dataset Versioning

Every dataset version needs:

- version id
- sample count
- scenario distribution
- annotation schema version
- QC summary
- source description
- known limitations

Use DVC or an equivalent versioning strategy for dataset artifacts.

## Annotation Classes

Detection classes:

- person
- pet
- stone
- tree
- fence
- obstacle-other

Segmentation classes:

- lawn
- soil
- boundary
- forbidden-zone
- obstacle-region

## Quality Control

QC should track:

- missing labels
- wrong class
- poor boundary
- unclear occlusion
- small object issue
- blur or image quality issue
