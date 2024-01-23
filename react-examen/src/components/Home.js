import React, { Component } from 'react';
import BookList from './BookList';

class Home extends Component {
    render() {
        return (
            <div>
                <h3>Últimos Libros</h3>
                <BookList cantidadLibros={3} />
            </div>
        );
    }
}

export default Home;
