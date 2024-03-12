# Web Config

Web configure is pre-register the node packages required by the
web application. It's used for remove the common works of installing
the packages again and again for web application. The default configure
is shipped with:

Production (``dependencies``):
  - ReactJS (``react``)
  - React DOM (``react-dom``)
  - React Router (``react-router-dom``)

Development (``devDependencies``):
  - Jest Dom (``jest-dom``)
  - React Testing Library (``@testing-library/react``)
  - Testing Library User Event (``@testing-library/user-event``)
  - TailwindCSS (``tailwindcss``)
  - Webpack (``webpack``)

## Add to Web App

To add the default required packages (for development and production)
we need to add to the ``package.json`` dependencies as the following:

```json
  "dependencies": {
    "@core/web-config": "^1.0.0"
  }
```

