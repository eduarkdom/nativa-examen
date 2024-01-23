import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Index from '../components/Home';
import NotFound from '../routes/404';
import NewBook from '../components/NewBook';
import UpdateBook from '../components/UpdateBook';  
import BookDetail from '../components/BookDetail';  
import BookList from '../components/BookList'; 
import BookSearch from '../components/BookSearch';
import Menu from './Menu';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Menu />
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route exact path="/inicio" component={Index} />
                    <Route path="/libro/new" component={NewBook} />
                    <Route path="/libro/update/:id" component={UpdateBook} />
                    <Route path="/libro/detail/:id" component={BookDetail} />
                    <Route path="/libro/list" component={BookList} />
                    <Route path="/libro/search" component={BookSearch} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;
