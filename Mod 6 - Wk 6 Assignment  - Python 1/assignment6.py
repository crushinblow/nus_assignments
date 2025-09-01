# Assignment 6 - Python
# Variables
# a) Declare variables for user's name, age, and height. 
# Don't need to explicitly declare variable types - the interpreter automatically determines the type based on the value assign.
name = "Peter"       # String variable for name
age = 30             # Integer variable for age
height_cm = 172      # Integer variable for height in centimeters

# b) Print a greeting message using the name
print(f"Hello, {name}!")  # f-string for formatted output - embed expressions using { }, expressions are evaluated at runtime and auto show results

# c) Calculate age 15 years from now
future_age = age + 15
print(f"In 15 years, you will be {future_age} years old.")

# d) Convert height from cm to meters and display
height_m = height_cm / 100  # 1 meter = 100 cm
print(f"Your height is {height_m:.2f} meters.")  # :.2f rounds to 2 decimal places

# Conditional Statement
# a) Prompt user to enter a number
num = float(input("Enter a number: "))  # float() handles decimals

# b) Check if number is positive, negative, or zero
if num > 0:
    print("The number is positive.")
elif num < 0:
    print("The number is negative.")
else:
    print("The number is zero.")
    
#Loops and Iteration    
# a) Prompt user to input an integer n
n = int(input("Enter an integer: "))

# b) Print even numbers from 1 to n using a for loop
print(f"Even numbers from 1 to {n}:")
for i in range(2, n+1, 2):  # Start at 2, step by 2 to get even numbers
    print(i)
        

#Functions
# a) Define a function to calculate rectangle area
def calculate_area(length, width):
    return length * width

# b) Prompt user for length and width
length = float(input("Enter length of the rectangle in metres: "))
width = float(input("Enter width of the rectangle in metres: "))

# c) Call the function and display the result
area = calculate_area(length, width)
print(f"The area of the rectangle is {area:.2f} sqm.")


