# Animal Disease Prediction

## Overview

This dataset contains comprehensive records of **animal disease outbreaks** reported globally from 2006 onwards. It includes detailed information about disease events, affected species, geographical locations, intervention measures, and outbreak outcomes. This data is invaluable for epidemiological analysis, disease prediction modeling, and understanding patterns in animal health crises worldwide.

## Source
- [WASHIS Dataset](https://wahis.woah.org/#/event-management)

## Dataset Statistics

- **Total Records**: 6,371 disease outbreak events
- **Total Features**: 48 columns
- **Geographic Coverage**: Global (multiple countries)
- **Time Period**: 2006 - Present
- **File Size**: ~3 MB
- **Format**: CSV (Comma-Separated Values)

## Use Cases

- **Disease Outbreak Prediction**: Build machine learning models to predict disease occurrence based on geographic and temporal patterns
- **Epidemiological Analysis**: Analyze disease spread patterns across regions and species
- **Intervention Effectiveness**: Study which intervention strategies are most effective for different diseases
- **Veterinary Decision Support**: Develop tools to assist veterinarians in disease management
- **Public Health Research**: Understand zoonotic disease patterns and risks
- **Policy Planning**: Inform animal health policy and resource allocation

## Data Structure

### Key Features

#### Geographic Information
- `country_name`: Country where the outbreak occurred
- `iso_code`: ISO country code (3-letter)
- `admin_division`: Administrative division/region within the country
- `latitude`: Geographic latitude coordinate
- `longitude`: Geographic longitude coordinate
- `location_approx`: Whether location is approximate (0 = exact, 1 = approximate)

#### Disease Information
- `event_id`: Unique identifier for each disease event
- `disease_name`: Name of the disease
- `disease_subtype`: Specific subtype of the disease (e.g., H5N1 for avian flu)
- `disease_group`: Category of disease (e.g., Aves, Multiple species)
- `causal_agent_type`: Type of causative agent (Virus, Bacteria, Parasite, etc.)

#### Affected Species
- `species_name`: Name of the affected animal species
- `is_wild`: Whether affected species is wild (1) or not (0)
- `is_domestic`: Whether affected species is domestic (1) or not (0)
- `is_aquatic`: Whether affected species is aquatic (1) or not (0)

#### Outbreak Details
- `epi_unit_type`: Type of epidemiological unit (Farm, Village, Lake, etc.)
- `susceptible`: Number of susceptible animals
- `cases`: Number of confirmed cases
- `deaths`: Number of animal deaths
- `killed`: Number of animals killed for disease control
- `slaughtered`: Number of animals slaughtered
- `vaccinated`: Number of animals vaccinated

#### Timeline
- `event_started_on`: When the event was first detected
- `event_confirmed_on`: When the event was officially confirmed
- `event_ended_on`: When the event was resolved
- `outbreak_start_date`: Start date of the outbreak
- `outbreak_end_date`: End date of the outbreak
- `last_occurrence`: Date of last previous occurrence
- `reported_on`: When the event was reported

#### Intervention Measures (Binary: 0/1)
- `intervention_quarantine_applied`: Quarantine measures implemented
- `intervention_movement_control_applied`: Movement restrictions applied
- `intervention_stamping_out_applied`: Stamping out (culling) performed
- `intervention_disinfection_applied`: Disinfection measures taken
- `intervention_surveillance_applied`: Surveillance programs implemented
- `intervention_screening_applied`: Screening conducted
- `intervention_disposal_applied`: Proper disposal methods used
- `intervention_vaccination_applied`: Vaccination campaigns conducted
- `intervention_zoning_applied`: Zoning restrictions implemented
- `intervention_vector_control_applied`: Vector control measures taken
- `intervention_wildlife_control_applied`: Wildlife control implemented
- `intervention_traceability_applied`: Traceability systems used
- `intervention_treatment_applied`: Treatment provided
- `intervention_slaughter_applied`: Slaughter measures taken
- `intervention_count`: Total number of interventions applied

#### Diagnosis & Status
- `lab_test_performed`: Number of laboratory tests performed
- `diagnostic_method_types`: Methods used for diagnosis (pipe-separated)
- `event_status`: Current status of the event (Resolved, Ongoing, etc.)
- `reason_type`: Reason for the event (First occurrence, Recurrence, etc.)

## Sample Use Cases with Code

### Loading the Dataset

```python
import pandas as pd
import numpy as np

# Load the dataset
df = pd.read_csv('dataset.csv')

# Basic exploration
print(f"Dataset Shape: {df.shape}")
print(f"\nColumn Names:\n{df.columns.tolist()}")
print(f"\nFirst Few Rows:\n{df.head()}")
```

### Disease Distribution Analysis

```python
# Most common diseases
disease_counts = df['disease_name'].value_counts().head(10)
print("Top 10 Most Common Diseases:")
print(disease_counts)

# Geographic distribution
country_outbreaks = df['country_name'].value_counts().head(10)
print("\nCountries with Most Outbreaks:")
print(country_outbreaks)
```

### Temporal Analysis

```python
# Convert date columns to datetime
df['event_started_on'] = pd.to_datetime(df['event_started_on'])
df['event_ended_on'] = pd.to_datetime(df['event_ended_on'])

# Extract year and month
df['year'] = df['event_started_on'].dt.year
df['month'] = df['event_started_on'].dt.month

# Outbreak trends over time
yearly_outbreaks = df.groupby('year').size()
print("Outbreaks per Year:")
print(yearly_outbreaks)
```

### Intervention Effectiveness

```python
# Analyze intervention effectiveness
intervention_cols = [col for col in df.columns if 'intervention_' in col and col != 'intervention_count']

# Calculate mortality rate
df['mortality_rate'] = df['deaths'] / df['cases'].replace(0, np.nan)

# Compare mortality rates with/without interventions
for intervention in intervention_cols:
    print(f"\n{intervention}:")
    print(df.groupby(intervention)['mortality_rate'].mean())
```

## Machine Learning Applications

### Classification Task: Predict Disease Type
```python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Prepare features for disease prediction
features = ['latitude', 'longitude', 'susceptible', 'cases', 
            'intervention_count', 'is_wild', 'is_domestic']

# Target: disease_name or disease_group
X = df[features].fillna(0)
y = df['disease_name']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

### Regression Task: Predict Outbreak Severity
```python
# Predict number of cases based on various factors
target = 'cases'
feature_columns = ['susceptible', 'intervention_count', 'is_wild', 
                   'is_domestic', 'latitude', 'longitude']

# Filter and prepare data
df_model = df[df[target] > 0].copy()
```

## Data Quality Notes

- **Missing Values**: Some columns contain null values, particularly in disease_subtype, last_occurrence, and specific intervention fields
- **Date Formats**: All dates are in ISO 8601 format with timezone information
- **Geographic Precision**: The `location_approx` field indicates whether coordinates are exact or approximate
- **Text Fields**: Some fields like `diagnostic_method_types` contain pipe-separated (|) multiple values

## Geographic Coverage

The dataset includes disease outbreaks from countries worldwide, including:
- North America (USA, Canada, Mexico)
- South America (Argentina, Bolivia, Ecuador, etc.)
- Europe (Denmark, Spain, Czech Republic, etc.)
- Asia (Japan, Thailand, Israel, Turkey, etc.)
- Africa (Niger, Botswana, etc.)

## Disease Types Covered

The dataset includes various animal diseases:
- **Viral Diseases**: Avian Influenza (H5N1, H5N3), Foot and Mouth Disease, Newcastle Disease, West Nile Fever
- **Bacterial Diseases**: Various bacterial infections
- **Parasitic Diseases**: Small hive beetle infection
- **Other**: Multiple disease types across different animal species

## Species Covered

- **Domestic Animals**: Cattle, Swine, Birds (poultry), Equidae (horses)
- **Wildlife**: Various wild bird species
- **Aquatic**: Fish species
- **Others**: Bees (Apidae)

## License

This dataset is released under the **MIT License**.

```
MIT License

Copyright (c) 2026 anmol420 & divy404

Permission is hereby granted, free of charge, to any person obtaining a copy
of this dataset and associated documentation files, to deal in the dataset 
without restriction, including without limitation the rights to use, copy, 
modify, merge, publish, distribute, sublicense, and/or sell copies of the 
dataset, and to permit persons to whom the dataset is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the dataset.
```

## Citation

If you use this dataset in your research or project, please cite it as:

```bibtex
@dataset{animal_disease_prediction,
  title={Animal Disease Prediction},
  author={anmol420 | divy404},
  year={2026},
  publisher={Kaggle},
  url={https://www.kaggle.com/datasets/anmol420/animal-disease-prediction}
}
```

Or in text format:
```
Animal Disease Prediction. 
Kaggle. https://www.kaggle.com/datasets/anmol420/animal-disease-prediction
```

## Contributors

- [anmol420](https://github.com/anmol420)
- [divy404](https://github.com/divy404)

## Contact & Support

- **Issues**: Report data quality issues or ask questions in the Kaggle discussion section
- **Contributions**: We welcome feedback and suggestions for dataset improvements
- **Updates**: Check the version history for dataset updates and changes

## Version History

- **v1.0** (February 2026) - Initial release
  - 6,371 outbreak records
  - 48 features
  - Global geographic coverage
  - Time period: 2006 - Present

## Acknowledgments

This dataset aggregates publicly reported animal disease outbreak information from various veterinary and public health sources worldwide.

## Disclaimer

This dataset is provided for research and educational purposes. While efforts have been made to ensure data accuracy, users should verify critical information with original sources - *WAHIS* - for any application with real-world implications.

---

**Created by anmol420 | divy404** | 2026 | For questions, visit the Kaggle dataset page