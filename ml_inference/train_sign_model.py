import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# 1. Load your data
# Make sure 'sign_language.csv' is in the same folder!
data = pd.read_csv('sign_language.csv') 

# 2. Separate Features (X) from Labels (y)
X = data.iloc[:, :-1] # These are the 21 finger points
y = data.iloc[:, -1]  # This is the letter/word name

# 3. Create the 'Forest' (the Council of Experts)
model = RandomForestClassifier(n_estimators=100)

# 4. Train the brain (This is where the learning happens)
print("Training the model... please wait.")
model.fit(X, y)

# 5. Freeze the brain into a file
with open("sign_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Success! 'sign_model.pkl' has been created.")