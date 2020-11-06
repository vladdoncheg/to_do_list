# To Do List

App uses Ruby on Rails, React.js and Bulma.

## Run locally

0. Ensure You have installed:

* Ruby (with [rvm](https://rvm.io/) for example)
* [Node.js](https://nodejs.org/en/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/)
* [PostgreSQL](https://www.postgresql.org/download/)

1. Install bundler:

    ```bash
    gem install bundler
    ```

2. Install ruby dependencies:

    ```bash
    bundle install
    ```

3. Install js dependencies:

    ```bash
    yarn install
    ```

4. Prepare the database:

    ```bash
    bundle exec rails db:create
    bundle exec rails db:migrate
    bundle exec rails db:seed
    ```

5. Run the application:

    ```bash
    bundle exec rails server
    ```
