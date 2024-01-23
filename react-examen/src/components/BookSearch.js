import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';

class BookSearch extends Component {
    state = {
        field: "nombreLibro",
        search: "",
        redirect: false,
        libros: [],
        status: null,
    };

    searchByField = (e) => {
        e.preventDefault();
        const { field, search } = this.state;
        
        this.setState({
            status: 'loading',
        });

        this.searchLibros(field, search)
            .then(response => {
                this.setState({
                    libros: response.data.libros || [],
                    status: 'success'
                });
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    status: 'error'
                });
            });
    };

    searchLibros = (field, search) => {
        const apiUrl = `${URL.API}/libro/busqueda?${field}=${search}`;
        return axios.get(apiUrl);
    };

    render() {
        if (this.state.redirect) {
            const { field, search } = this.state;
            return <Redirect to={`/libro/search?field=${field}&search=${search}`} />;
        }

        return (
            <div>
                <form onSubmit={this.searchByField}>
                    <table>
                        <tr>
                            <td>Buscar por</td>
                            <td>
                                <select onChange={(e) => this.setState({ field: e.target.value })} value={this.state.field}>
                                    <option value="nombreLibro">Nombre del Libro</option>
                                    <option value="autor">Autor</option>
                                    <option value="editorial">Editorial</option>
                                </select>
                            </td>
                            <td>
                                <input type="text" name="search" value={this.state.search} onChange={(e) => this.setState({ search: e.target.value })} />
                            </td>
                            <td>
                                <input type="submit" name="submit" value="Buscar" />
                            </td>
                        </tr>
                    </table>
                </form>

                {this.state.status === 'success' && this.state.libros.length > 0 && (
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
                                            <img src={URL.API + '/libro/archivo/' + libro.portada} alt={libro.nombreLibro} height="100px" width="100px" />
                                        ) : (
                                            <img src="https://www.example.com/default-image.jpg" alt={libro.nombreLibro} height="100px" width="100px" />
                                        )}
                                    </td>
                                    <td>{libro.nombreLibro}</td>
                                    <td>{libro.autor}</td>
                                    <td>{libro.editorial}</td>
                                    <td>
                                        <Link to={`/libro/detail/${libro._id}`}>Detalles</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {this.state.libros.length === 0 && this.state.status === 'success' && (
                    <div>
                        <h2>No se encontraron libros con los criterios proporcionados</h2>
                    </div>
                )}

                {this.state.status === 'error' && (
                    <div>
                        <h2>No se han encontrado la busqueda</h2>
                    </div>
                )}

                {this.state.status === 'loading' && (
                    <div>
                        <h2>Cargando...</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default BookSearch;