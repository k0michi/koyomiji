import * as Nano from "nano-jsx";
import * as Router from 'nano-jsx/lib/components/router.js';
import AboutPage from "./about-page.js";
import IndexPage from "./index-page.js";
import KnowledgeIndexPage from "./knowledge-index-page.js";
import KnowledgePage from "./knowledge-page.js";
import LogIndexPage from "./log-index-page.js";
import LogPage from "./log-page.js";

export function Root(props: any) {
  return (
    <Router.Switch fallback={() => <div>404 (not found)</div>}>
      <Router.Route exact path="/">
        <IndexPage {...props} />
      </Router.Route>
      <Router.Route exact path="/about">
        <AboutPage {...props} />
      </Router.Route>
      <Router.Route exact path="/log/:id">
        <LogPage {...props} />
      </Router.Route>
      <Router.Route exact path="/knowledge/:category/:id">
        <KnowledgePage {...props} />
      </Router.Route>
      <Router.Route exact path="/log">
        <LogIndexPage {...props} />
      </Router.Route>
      <Router.Route exact path="/knowledge">
        <KnowledgeIndexPage {...props} />
      </Router.Route>
    </Router.Switch>
  );
}