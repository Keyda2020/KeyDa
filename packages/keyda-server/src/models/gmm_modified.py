import sys
import pandas as pd
import numpy as np
import io
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.mixture import GaussianMixture


def run_model(path):
    data_set = pd.read_csv(path)

    scaler = StandardScaler()
    data = data_set.iloc[0:data_set.shape[0]-2, :]
    target = data_set.iloc[data_set.shape[0]-2:data_set.shape[0]-1, :]

    train_data, test_data = train_test_split(data, test_size=.5)
    test_data = pd.concat([test_data, target])

    train_data = scaler.fit_transform(train_data)
    test_data = scaler.fit_transform(test_data)

    model = GaussianMixture().fit(train_data)
    res = list()
    for i in range(0, test_data.shape[0]):
        var = model.score(test_data[i, :].reshape(1, -1))
        res.append(var)
    res = np.array(res)

    scaled_score = ((100-0) / (np.max(res)-np.min(res))) * \
        (res[-1]-np.max(res))+100
    print(scaled_score)


if __name__ == '__main__':
    path = sys.argv[1]
    run_model(path)
