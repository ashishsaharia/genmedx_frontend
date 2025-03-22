/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/about`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/auth/login`; params?: Router.UnknownInputParams; } | { pathname: `/auth/signUp`; params?: Router.UnknownInputParams; } | { pathname: `/home/chat`; params?: Router.UnknownInputParams; } | { pathname: `/home/homePage`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/about`; params?: Router.UnknownOutputParams; } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/auth/login`; params?: Router.UnknownOutputParams; } | { pathname: `/auth/signUp`; params?: Router.UnknownOutputParams; } | { pathname: `/home/chat`; params?: Router.UnknownOutputParams; } | { pathname: `/home/homePage`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/about${`?${string}` | `#${string}` | ''}` | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/auth/login${`?${string}` | `#${string}` | ''}` | `/auth/signUp${`?${string}` | `#${string}` | ''}` | `/home/chat${`?${string}` | `#${string}` | ''}` | `/home/homePage${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/about`; params?: Router.UnknownInputParams; } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/auth/login`; params?: Router.UnknownInputParams; } | { pathname: `/auth/signUp`; params?: Router.UnknownInputParams; } | { pathname: `/home/chat`; params?: Router.UnknownInputParams; } | { pathname: `/home/homePage`; params?: Router.UnknownInputParams; };
    }
  }
}
