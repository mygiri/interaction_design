# %%

from flask import Flask, send_from_directory, url_for

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pySequentialLineSearch as pysls
import numpy as np
from typing import List
import os
import json

# import pandas
counter = 0
optimizer_dict = dict()
selection_type = "pairwise"
log_dict = dict()


def pprint(string):
    """Printing for Debugging purposes"""
    print(string, flush=True)


app = Flask(__name__, static_folder="./static_html", static_url_path="/")

origins = [
    "http://localhost:33000",
    "http://localhost:5000",
    "http://localhost:3000",
    "https://maps.googleapis.com",
    "http://maps.googleapis.com",
]

# %%

# Needed participants in each condition are read from environment variables.
try:
    amount_c1 = int(os.environ["C1"])
    amount_c2 = int(os.environ["C2"])
    amount_c3 = int(os.environ["C3"])
except:
    amount_c1 = 1000
    amount_c2 = 1000
    amount_c3 = 1000

# determines how often each page is shown/tested to/by user
conditions = np.concatenate(
    [
        np.repeat(key, value)
        for key, value in {
            "c1": amount_c1,
            "c2": amount_c2,
            "c3": amount_c3,
        }.items()
    ]
)

np.random.shuffle(conditions)

conditions_remaining = conditions.tolist()
# %%

userid_to_condition_mapping = dict()

#also contion mapping - each user is assigned a c123 from the conditons remaining list
@app.route("/get_condition/<string:user_id>")
@cross_origin(origins=origins)
def get_condition(user_id):
    global conditions

    if user_id in userid_to_condition_mapping:
        selected_condition = userid_to_condition_mapping[user_id]
        pprint("got from dict")
    elif len(conditions_remaining) > 0:
        selected_condition = conditions_remaining.pop()
        userid_to_condition_mapping[user_id] = selected_condition
        pprint("pop from list")
    else:
        pprint("random choice")
        selected_condition = np.random.choice(["c1", "c2", "c3"], 1)[0]

    return jsonify({"condition": selected_condition})


# %%


@app.route("/get_api_key")
@cross_origin(origins=origins)
def get_api_key():
    apikey = os.environ["APIKEY"]

    return jsonify({"apikey": apikey})


@app.route("/static/<path:path>")
@cross_origin(origins=origins)
def get_static_html_page(path):
    file_path = f"static/{path}.html"
    return send_from_directory("static_html", file_path)


@app.route("/")
@cross_origin(origins=origins)
def start():
    return app.send_static_file("index.html")


#######################################################################################
#######################################################################################
#######################################################################################
# Initialize Human-in-the-Loop Bayesian Optimization Run for a new User.


def gen_initial_query(num_dims: int, _) -> List[np.ndarray]:
    """Generate a query for the first iteration."""
    return [
        np.random.uniform(low=0.01, high=1, size=num_dims),
        np.random.uniform(low=0.01, high=1, size=num_dims),
    ]


def initialize_bayesian_run(dimensionality=1) -> None:

    optimizer = pysls.PreferentialBayesianOptimizer(
        num_dims=dimensionality,
        initial_query_generator=gen_initial_query,
    )

    optimizer.set_hyperparams(
        kernel_signal_var=0.2,
        kernel_length_scale=0.10,
        kernel_hyperparams_prior_var=0.10,
    )

    return optimizer


@app.route("/init/<string:user_id>/<int:num_dims>")
@cross_origin(origins=origins)
def initialize_session(user_id, num_dims):
    """Initializes an optimizer object for a new user."""

    global optimizer_dict
    global selection_type

    optimizer_list = []
    for _ in range(num_dims):

        optimizer = initialize_bayesian_run(dimensionality=1)
        optimizer_list.append(optimizer)

    optimizer_dict[user_id] = optimizer_list

    return_string = (
        f"Initialized pairwise run for user id {user_id} with {num_dims} dimensions"
    )

    return return_string


#######################################################################################
#######################################################################################
#######################################################################################


@app.route("/get_current_options/<string:user_id>")
@cross_origin(origins=origins)
def get_current_options(user_id):
    """Returns current privacy levels sampled by the Optimizer for a specific user."""

    global optimizer_dict

    if user_id in optimizer_dict:
        option_1 = []
        option_2 = []
        for i in range(len(optimizer_dict[user_id])):
            options = optimizer_dict[user_id][i].get_current_options()
            option_1.append(options[0][0])
            option_2.append(options[1][0])

        for i in range(len(option_1)):
            if option_1[i] < 0.001:
                option_1[i] = 0.001
            option_1[i] = round(option_1[i], 4)

            if option_2[i] < 0.001:
                option_2[i] = 0.001
            option_2[i] = round(option_2[i], 4)
    else:
        pprint("user id not in optimizer dict")

        option_1 = "User  ID not set yet"
        option_2 = "User ID set yet"

    return_dict = {
        "user_id": user_id,
        "option_1": option_1,
        "option_2": option_2,
    }

    return jsonify(return_dict)


#######################################################################################
#######################################################################################
#######################################################################################


@app.route(
    "/submit_feedback_data",
    methods=["POST"],
)
@cross_origin(origins=origins)
def submit_feedback_data():
    """Submit user's privacy preference to the algorithm for a specific user"""
    global optimizer_dict
    global selection_type

    content = request.get_json()

    user_id = content["user_id"]
    optimizer_index = content["optimizer_index"]
    selected_index = content["selected_index"]

    if user_id in optimizer_dict:
        pprint("user is is in optimizer dict")
        optimizer_dict[user_id][optimizer_index].submit_feedback_data(selected_index)
        optimizer_dict[user_id][optimizer_index].determine_next_query()

        return f"Submitted feedback for user {user_id}"
    else:
        pprint("ERROR: user is is not in optimizer dict")
        return "ERROR: user is is not in optimizer dict"


#######################################################################################
#######################################################################################
#######################################################################################


@app.route("/reinitialize_optimizer/<string:user_id>/<int:optimizer_index>")
@cross_origin(origins=origins)
def reinitialize_optimizer(user_id, optimizer_index):
    """Reinitializes an optimizer if users wishes to edit privacy levels."""
    global optimizer_dict

    optimizer_dict[user_id][optimizer_index] = initialize_bayesian_run(dimensionality=1)

    return f"Reinitialized optimizer at index {optimizer_index} for user {user_id}"


@app.route("/healthy")
def health_check():
    global counter
    counter += 1
    print("healthy")

    return f"You have visited this page {counter} times"


@app.route("/log", methods=["POST"])
@cross_origin(origins=origins)
def log():
    """Logs user interaction to file."""
    log_message = request.get_json()

    global log_dict

    userid = log_message["userid"]
    event = log_message["event"]
    datetime = log_message["datetime"]
    if "LOGDIR" in os.environ:
        log_directory = os.environ["LOGDIR"]
    else:
        log_directory = "./logs"
        os.makedirs(log_directory, exist_ok=True)

    file_name = f"{log_directory}/{datetime}_{userid}_{event}.log"

    with open(file_name, "w") as f:
        f.write(json.dumps(log_message))

    return f"{log_message}"


# %%

if __name__ == "__main__":
    app.run()
