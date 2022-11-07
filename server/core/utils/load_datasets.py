import numpy as np
import pandas as pd

# Leemos los datasets
def load_datasets(path):
    return pd.read_csv(path)
