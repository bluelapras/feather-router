<!-- Feather Router LOGO -->
<p align="center">
  <img width="300" draggable="false" src="https://raw.githubusercontent.com/bluelapras/feather-router/main/static/dark-mode/feather-router-logo.png#gh-dark-mode-only" />
</p>

<p align="center">
  <img width="300" draggable="false" src="https://raw.githubusercontent.com/bluelapras/feather-router/main/static/light-mode/feather-router-logo.png#gh-light-mode-only" />
</p>

<!-- Feather Router Badges -->
<p align="center">
  <a href="https://www.npmjs.com/package/feather-router">
    <img alt="npm" src="https://img.shields.io/npm/dw/feather-router?style=for-the-badge">
  </a>
  <a href="https://www.npmjs.com/package/feather-router">
    <img alt="npm" src="https://img.shields.io/npm/v/feather-router?style=for-the-badge">
  </a>
  <a href="https://www.npmjs.com/package/feather-router">
    <img alt="NPM" src="https://img.shields.io/npm/l/feather-router?style=for-the-badge">
  </a>
    <a href="https://www.npmjs.com/package/feather-router">
    <img alt="NPM" src="https://img.shields.io/bundlephobia/minzip/feather-router?style=for-the-badge">
  </a>
</p>

<!-- Feather Router Hero Example -->
<div align="center">
  <img src="https://raw.githubusercontent.com/bluelapras/feather-router/main/static/feather-hero-example.png" />
</div>

<!-- Feather Router Description -->

Feather Router is a lightweight and lightning fast routing library for React applications. Easily manage your app's navigation and handle URL changes with a simple and intuitive API.

Feather Router is designed with simplicity and ease of use in mind, making it an ideal choice for React developers who value an elegant and efficient routing solution. Despite its lightweight design, Feather Router is also highly customizable, giving you the flexibility to create the routing experience that best suits your app's needs.

## Table of Contents

- [Getting Started](#getting-started)
- [API Reference](#feather-router-api)
  - [Components](#components)
    - [`<Router />`](#router)
    - [`<Route />`](#route-path-component)
  - [Hooks](#hooks)
    - [`useRouteParams`]
    - [`useBrowserPath`]

## Getting Started

Add the package using NPM, Yarn, or the package manager of your choice!

```bash
npm install feather-router
```

```
yarn add feather-router
```

## Feather Router API

Feather Router provides a set of components and hooks that enable you to manage navigation and routing logic in your React application.

### Components

**Summary**

- `<Router />` is a top level component which wraps `<Route />` components. It handles the logic of rendering the correct child `<Route />` for the current browser path.
- `<Route />` components define what content is displayed when a particular URL is accessed.

**API**

### `<Router />`

A top-level routing component that manages client side navigation by rendering child `<Route />` components based on the current browser path.

> **Tip**: Browser path refers to the unique, last part of a URL.
>
> - The URL `www.example.com` has a browser path of "/"
> - The URL `www.example.com/about` has a browser path of "/about".

All child `<Route />` components must be nested within a parent `<Router />` component.

```jsx
import { Router, Route } from "feather-router";

function App() {
  return (
    <Router>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
    </Router>
  );
}
```

In this example:

- If the user navigates to `www.example.com`, the `HomePage` component is rendered.
- If the user navigates to `www.example.com/about`, the `AboutPage` component is rendered.

> **Read more** → How does `<Router />` match a `<Route />`?

### `<Route path="" component={} />`

The Route component defines the React component that should be rendered for a given browser path.

> **Tip**: A `<Route />` component must be nested within a parent `<Router />` component!

- `path` is a **required property**. It is a string which represents the browser path of the `<Route />`. It must start with a forward slash `/`.
- `component` is **an optional property**. It is the React component that will be rendered if the browser path matches the path specified by the `<Route />`

`<Route />` components can use wildcard **dynamic segments** in their path to match anything. The syntax for creating a dynamic segment is a colon `:property_name`.

> **Example**: `<Route path="/user/:id" component={UserPage} />`

In the above example, browser URLs such as:

- `www.example.com/user/foo`
- `www.example.com/user/bar`
- `www.example.com/user/bazz`

Will all match the path specified by the example `<Route />`. The value of the dynamic segment (foo, bar, bazz) is extracted from the URL, and will be passed as a property to the `UserPage` component. The name of the property in this example is `id`.

When you create a dynamic segment, Feather Router uses the text after the `:` (colon) as the property name. A path can have multiple dynamic segments.

`<Route path="/:foo/:bar/:baz" component={MyComponent} />` will pass properties named `foo`, `bar`, and `baz` to `MyComponent`.

`<Route />` components can also be nested within other `<Route />` components.

```jsx
import { Router, Route } from "feather-router";

function App() {
  return <>
    <Router>
      <Route path="/" component={HomePage}> /> // A
      <Route path="/blog"> // B
        <Route path="/:blog_id" component={BlogPage} /> // C
        <Route path="/new" component={NewBlogPage} /> // D
      </Route>
    </Router>
  </>
}
```

In this example:

- `www.example.com` matches route A.
- `www.example.com/blog` matches route B. Since no component was provided, nothing is rendered.
- `www.example.com/blog/new` matches route D.
- `www.example.com/blog/57` matches route C, and provides a property named `blog_id` with value "57" to component `BlogPage`.

```jsx
function BlogPage({ blog_id }) {
  return <>
    <h1>Welcome to Blog #{blog_id}</h1>
  <>
}
```

Did you notice that `www.example.com/blog/new` matched route D, even though it met the criteria for route C as well? In the event of multiple routes matching a browser path, Feather Router will favour **static routes** over **dynamic routes**.

> A static route is a route that does not contain any dynamic segments. A dynamic route is a route that contains dynamic segments.

### Hooks

- `useRouteParams` provides a direct way to access the dynamic parameters that are matched by the current URL.
- `useBrowserPath` provides a straightforward means of modifying and retrieving the current URL path.

## Contributing

We love contributions to Feather Router, and welcome developers of all levels to get involved! Here's how you can contribute:

1. Browse our list of open issues or feature requests to find something you're interested in working on. If you don't see anything
   that interests you, feel free to submit a new issue or feature request!
2. Fork the Feather Router repository and create a new branch for your changes. Make sure to document and test your change!
3. Submit a pull request and describe the changes you made!

Remember, no contribution is too big or too small! You can help in many ways, such as fixing bugs, adding new features, improving documentation, writing tests, or giving feedback.

Please be respectful and follow the Github code of conduct when interacting with other contributors. We aim to create a friendly and inclusive community for everyone.

Thank you for considering contributing to Feather Router!
