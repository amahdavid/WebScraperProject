import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import URLInputPage from './pages/URLInputPage';
import QuestionPage from './pages/QuestionPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={URLInputPage}/>
                <Route path="/questions" exact component={QuestionPage}/>
            </Switch>
        </Router>
    )
}

export default App;