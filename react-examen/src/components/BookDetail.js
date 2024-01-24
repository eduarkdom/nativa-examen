import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';



class BookDetail extends Component {
    url = URL.API;
    state = {
        libro: {},
    };

    componentDidMount() {
        this.getLibroById();
    }

    getLibroById = () => {
        const id = this.props.match.params.id;
        axios.get(`${this.url}/libro/id/${id}`)
            .then(res => {
                this.setState({
                    libro: res.data.libro,
                });
            })
            .catch(err => {
                this.setState({
                    libro: null,
                });
            });
    };

    goUpdate = (id) => {
        this.props.history.push(`/libro/update/${id}`);
    };
    

    deleteLibroById = (id) => {
        axios.delete(`${this.url}/libro/${id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    window.alert('Libro Eliminado');
                    this.props.history.push('/');
                }
            })
            .catch(err => {
                console.error('Error deleting libro:', err);
            });
    };

    render() {
        return (
            <div className='containerHtml'>
                {this.state.libro && (
                    <div>
                        <table border="1px">
                            <tbody>
                                <tr>
                                    <td>ISBN</td>
                                    <td>{this.state.libro.ISBN}</td>
                                </tr>
                                <tr>
                                    <td>Nombre del Libro</td>
                                    <td>{this.state.libro.nombreLibro}</td>
                                </tr>
                                <tr>
                                    <td>Autor</td>
                                    <td>{this.state.libro.autor}</td>
                                </tr>
                                <tr>
                                    <td>Editorial</td>
                                    <td>{this.state.libro.editorial}</td>
                                </tr>
                                <tr>
                                    <td>Portada</td>
                                    <td>
                                        {this.state.libro.portada ? (
                                            <img
                                                src={`${this.url}/libro/archivo/${this.state.libro.portada}`}
                                                alt={this.state.libro.portada}
                                                width="200px"
                                                height="200px"
                                            />
                                        ) : (
                                            <img
                                                src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                                                alt=""
                                                width="200px"
                                                height="200px" />
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Páginas</td>
                                    <td>{this.state.libro.paginas}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <button onClick={() => this.goUpdate(this.state.libro._id)} className='btnActualizar'>
                                            Actualizar
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => this.deleteLibroById(this.state.libro._id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
                {!this.state.libro && this.state.status === 'success' && (
                    <div>
                        <h2>Libro no encontrado</h2>
                        <h3>Intenta más tarde</h3>
                        <NavLink to="/libro/list">Regresar</NavLink>
                    </div>
                )}
                {this.state.status === null && (
                    <div>
                        <h2>Cargando...</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(BookDetail);
