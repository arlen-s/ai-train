# Delivery Checklist

Use this checklist before claiming V2 is complete.

## Product Delivery

- [ ] AI skill/tool discovery gate was checked before implementation
- [ ] PM project requirements document is written before prototype design
- [ ] Requirement decomposition is current
- [ ] Static PM prototype exists at `docs/product/prototypes/pm-wireframes.html`
- [ ] Implementation roadmap is current
- [ ] Repository structure guidance is current
- [ ] Overview dashboard exists
- [ ] Scenario matrix workflow exists
- [ ] Dataset version workflow exists
- [ ] Annotation/QC workflow exists
- [ ] Perception training workflow exists
- [ ] RL training workflow exists
- [ ] Generalization evaluation workflow exists
- [ ] Badcase library exists
- [ ] Report export or report artifact exists
- [ ] V3 backlog is visible and separated from V2 scope
- [ ] Simulated sensor fields are represented in the product and API model
- [ ] Dynamic obstacle scenarios are represented in the product and API model
- [ ] 3D-ready replay data exists or is specified in executable detail
- [ ] ONNX export and latency benchmark records exist
- [ ] Badcase recommendation workflow exists

## Data Delivery

- [ ] Scenario taxonomy is documented
- [ ] Dataset version metadata is recorded
- [ ] Cleaning rules are documented or implemented
- [ ] Annotation classes are documented
- [ ] QC issue categories are documented
- [ ] At least one dataset iteration story exists

## Perception Delivery

- [ ] Obstacle detection workflow is documented or implemented
- [ ] Segmentation workflow is documented or implemented
- [ ] Training run records include config, dataset version, metrics, and artifact reference
- [ ] Evaluation metrics include detection and segmentation metrics
- [ ] Perception Badcases are categorized

## RL Delivery

- [ ] Custom 2D environment exists or is specified in executable detail
- [ ] Observation space is defined
- [ ] Action space is defined
- [ ] Reward function is defined
- [ ] PPO baseline is trained or training workflow is implemented
- [ ] Rule-based or random baseline exists for comparison
- [ ] Evaluation includes training, validation, and unseen scenarios
- [ ] Failure episode categories are documented

## Testing Delivery

- [ ] API tests are present for implemented backend modules
- [ ] Data validation tests are present for implemented data pipeline modules
- [ ] RL environment tests cover reset, step, reward, collision, boundary, and termination
- [ ] Metric tests cover controlled examples
- [ ] Frontend workflow checks cover critical pages
- [ ] Verification commands are recorded

## Documentation Delivery

- [ ] `AGENTS.md` is current
- [ ] PRD is current
- [ ] PM prototype notes are current
- [ ] Architecture document is current
- [ ] Data pipeline document is current
- [ ] Model training document is current
- [ ] RL training document is current
- [ ] Evaluation and Badcase document is current
- [ ] V3 backlog is current
- [ ] Resume-ready project summary is written

## Final Gate

Do not call the project complete unless:

- V2/V3 scope is clear
- implemented behavior matches product docs
- tests or manual verification are recorded
- known gaps are documented
- next iteration backlog is ready
