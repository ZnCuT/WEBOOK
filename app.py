from flask import Flask, render_template, request, redirect, url_for, send_from_directory, session, flash
from config import Config
import os
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from flask_bcrypt import Bcrypt

app = Flask(__name__)
app.config.from_object(Config)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['SECRET_KEY'] = os.urandom(24)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

@app.before_request
def create_tables():
    db.create_all()

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(80), nullable=False)
    degree_of_wear = db.Column(db.String(80), nullable=False)
    image = db.Column(db.LargeBinary, nullable=False)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), unique=True, nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.email}>'

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method in ['GET', 'POST']:
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            flash('Login successfully!')
            return redirect(url_for('login_success'))
        else:
            flash('Invalid credentials. Please try again.')
    return render_template('login.html')

@app.route('/get')
def get_session():
    return session.get('user_id')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Username already exists.')
            return redirect(url_for('register'))
        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful! Please log in.')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/homepage')
def homepage():
    products = Product.query.all()  
    return render_template('homepage.html', products=products)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        name = request.form.get('name')
        price_str = request.form.get('price')
        if not price_str:
            flash('Please enter the price')
            return "Price is required"
        price = float(price_str)
        description = request.form.get('description')
        degree_of_wear = request.form.get('degree_of_wear')
        image = request.files['image']

        if image and image.filename!= '':
            image_data = image.read()
        else:
            image_data = None

        new_product = Product(name=name, price=price, description=description, degree_of_wear=degree_of_wear, image=image_data)
        db.session.add(new_product)
        db.session.commit()
        return "Upload successfully"
    return render_template("upload.html")

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'POST':
        query = request.form.get('query')
        if not query:
            flash('No query provided.')
            return redirect(url_for('search'))
        results = Product.query.filter(Product.name.ilike(f"%{query}%")).all()
        return render_template('results.html', results=results, query=query)
    return render_template('search.html')

@app.route('/products/<int:id>')
def book_detail(id):
    product = Product.query.get(id)
    if product is None:
        return "Product not found", 404
    return render_template('check_data.html', products=[product])

@app.route('/buy/<int:id>', methods=['POST', 'GET'])
def book_details(id):
    product = Product.query.get(id)
    if product is None:
        return "Product not found", 404
    db.session.delete(product)
    db.session.commit()
    return "delete successfully!"

@app.route('/WEBOOK')
def WEBOOK():
    return render_template("/WEBOOK.html")

@app.route('/login_success')
def login_success():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('login_success.html')

@app.route('/info')
def info():
    return render_template('/info.html')

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True, port=5003)