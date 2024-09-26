# 🎛️ Synth

Generate fake data, fast.

Synth simulates databases for large organizations by generating schemas and scripts to create realistic fake data. It then populates a PostgreSQL database with this synthetic information.

## 🎥 Demo

<iframe src="https://vimeo.com/1012610277" width="640" height="360" frameborder="0" allow="autoplay;"></iframe>

## 🚀 Running the Project

To run this project, follow these simple steps:

1. Clone the repository to your local machine.
2. Make a copy of the `.env.template` file and rename it to `.env`. Fill in the required environment variables:
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `OPENAI_API_KEY`: Your OpenAI API key
3. Ensure you have Docker installed on your system.
4. Navigate to the project directory in your terminal.
5. Run the command `docker-compose up` to start the project.
6. Wait for the containers to start. This might take a couple of minutes.
7. Once the containers are running, you can access the frontend at `http://localhost:3000` and the backend at `http://localhost:8000/api/v1`.

That's it! You should now have Synth up and running on your local machine.
