import pandas as pd
import numpy as np
import io
import sys

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.mixture import GaussianMixture


def getUserInfo(path):
    df = pd.read_csv(path, error_bad_lines=False)
    return df


def pre_process(data):
    scaler = StandardScaler()
    return scaler.fit_transform(data)


def post_process(score, threshold, n_sample):
    if score >= threshold:
        if n_sample > 100:
            df = pd.read_csv(path, error_bad_lines=False)
            df = df.iloc[1:1+100, :]
            df.to_csv(path, index=False)
    else:
        pass
    return 0


def getUserScore(data):
    pre_data = pre_process(data)

    model = GaussianMixture().fit(pre_data)
    res = list()
    for i in range(0, pre_data.shape[0]):
        var = model.score(pre_data[i, :].reshape(1, -1))
        res.append(var)
    res = np.array(res)
    val = ((100-0) // (np.max(res)-np.min(res)))*(var-np.max(res))+100

    post_process(score=val, threshold=40, n_sample=pre_data.shape[0])

    return val


if __name__ == '__main__':
    path = sys.argv[1]
    data = getUserInfo(path)
    print(getUserScore(data))
