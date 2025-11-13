# run.py
from app import create_app
from app.utils.auth import load_user

app, login_manager = create_app()

@login_manager.user_loader
def user_loader(user_id):
    return load_user(user_id)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)  