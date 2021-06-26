# Project Name

Overview



## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

To seed database:
```sh
npm run fake100
```
To create bundle:
```sh
npm run build
```
To start server:
```sh
npm run start
```

## API Endpoints

- **POST** `/overview`
- **GET** `/overview?courseId=id`
- **PUT** `/overview?courseId=id`
- **DELETE** `/overview?courseId=id`

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

