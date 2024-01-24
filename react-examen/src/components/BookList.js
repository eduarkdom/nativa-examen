import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';

class BookList extends Component {
    url = URL.API;

    state = {
        libros: [],
        status: null
    };

    componentDidMount() {
        this.getLibros();
    }

    getLibros = () => {
        const { cantidadLibros } = this.props;
        const endpoint = cantidadLibros ? `/libros/${cantidadLibros}` : '/libros';

        axios.get(`${this.url}${endpoint}`).then(res => {
            this.setState({
                libros: res.data.libros || [],
                status: 'success'
            });
        }).catch(error => {
            console.error('Error fetching libros:', error);
            this.setState({
                status: 'error'
            });
        });
    };

    render() {
        return (
            <div className='containerHtml'>
                {this.state.status === 'success' && (
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Fotografía</th>
                                <th>Nombre del Libro</th>
                                <th>Autor</th>
                                <th>Editorial</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.libros.map(libro => (
                                <tr key={libro._id}>
                                    <td>
                                        {libro.portada ? (
                                            <img src={this.url + '/libro/archivo/' + libro.portada} alt={libro.nombreLibro} height="100px" width="100px" />
                                        ) : (
                                            <img src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg" alt={libro.nombreLibro} height="100px" width="100px" />
                                        )}
                                    </td>
                                    <td>{libro.nombreLibro}</td>
                                    <td>{libro.autor}</td>
                                    <td>{libro.editorial}</td>
                                    <td>
                                        <div className='btnDetail'>
                                            <NavLink to={`/libro/detail/${libro._id}`}>Detalles</NavLink>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {this.state.libros.length === 0 && this.state.status === 'error' && (
                    <div>
                        <h2>No hay libros para mostrar</h2>
                    </div>
                )}
                {this.state.status !== 'success' && this.state.status !== 'error' && (
                    <div>
                        <h2>Cargando...</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default BookList;
