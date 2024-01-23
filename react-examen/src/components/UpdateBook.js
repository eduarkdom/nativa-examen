import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class UpdateLibro extends Component {
    constructor(props) {
        super(props);

        this.url = URL.API;
        this.nombreLibroRef = React.createRef();
        this.autorRef = React.createRef();
        this.editorialRef = React.createRef();
        this.portadaRef = React.createRef();

        this.state = {
            libro: {
                _id: '',
                nombreLibro: '',
                autor: '',
                editorial: '',
                portada: '',
            },
            status: null,
            force: false,
        };

        this.validator = new SimpleReactValidator();
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        axios.get(`${this.url}/libro/${id}`)
            .then(res => {
                if (res.data.status === 'success') {
                    const libro = res.data.libro;
                    this.setState({
                        libro: {
                            _id: libro._id,
                            nombreLibro: libro.nombreLibro,
                            autor: libro.autor,
                            editorial: libro.editorial,
                            portada: libro.portada,
                        },
                        status: 'success',
                    });
                } else {
                    this.setState({
                        status: 'error',
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching libro details:', error);
                this.setState({
                    status: 'error',
                });
            });
    }

    changeState = () => {
        const nombreLibroValue = this.nombreLibroRef?.current?.value || '';
        const autorValue = this.autorRef?.current?.value || '';
        const editorialValue = this.editorialRef?.current?.value || '';

        this.setState({
            libro: {
                ...this.state.libro,
                nombreLibro: nombreLibroValue,
                autor: autorValue,
                editorial: editorialValue,
                portada: this.portadaRef?.current?.value || null,
            },
        });
    };

    fileChange = (e) => {
        this.setState({
            portada: e.target.files[0],
        });
    };

    updateLibro = (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            axios.put(`${this.url}/libro/${this.state.libro._id}`, this.state.libro)
                .then(res => {
                    if (res.data.status === 'success') {
                        const updatedLibro = res.data.libro;
                        this.setState({
                            libro: updatedLibro,
                            status: 'waiting',
                        });

                        if (this.state.portada !== null) {
                            const id = updatedLibro._id;
                            const formData = new FormData();
                            formData.append('file', this.state.portada, this.state.portada.name);

                            axios.post(`${this.url}/libro/upload/${id}`, formData)
                                .then(res => {
                                    if (res.data.status === 'success') {
                                        this.setState({
                                            status: 'success',
                                            force: true,
                                        });
                                        window.alert('Libro Actualizado');
                                    } else {
                                        this.setState({
                                            status: 'error',
                                        });
                                    }
                                })
                                .catch(error => {
                                    console.error('Error uploading portada:', error);
                                    this.setState({
                                        status: 'error',
                                    });
                                });
                        } else {
                            this.setState({
                                status: 'success',
                                force: true,
                            });
                        }
                    } else {
                        this.setState({
                            status: 'error',
                        });
                    }
                })
                .catch(error => {
                    console.error('Error updating libro:', error);
                    this.setState({
                        status: 'error',
                    });
                });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'error',
            });
        }
    };

    render() {
        if (this.state.force) {
            return <Redirect to="/inicio" />;
        }
        return (
            <div>
                {this.state.status === 'success' && (
                    <form onSubmit={this.updateLibro}>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nombre del Libro</td>
                                    <td>
                                        <input type="text" name="nombreLibro" ref={this.nombreLibroRef} value={this.state.libro.nombreLibro} onChange={this.changeState} />
                                        {this.validator.message('nombreLibro', this.state.libro.nombreLibro, 'required')}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Autor</td>
                                    <td>
                                        <input type="text" name="autor" ref={this.autorRef} value={this.state.libro.autor} onChange={this.changeState} />
                                        {this.validator.message('autor', this.state.libro.autor, 'required|alpha_space')}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Editorial</td>
                                    <td>
                                        <input type="text" name="editorial" ref={this.editorialRef} value={this.state.libro.editorial} onChange={this.changeState} />
                                        {this.validator.message('editorial', this.state.libro.editorial, 'required|alpha_space')}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Portada</td>
                                    <td>
                                        <input type="file" name="portada" ref={this.portadaRef} onChange={this.fileChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="submit" value="Actualizar Libro" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                )}
                {this.state.status === 'error' && (
                    <div>
                        <h2>Error cargando los detalles del libro</h2>
                    </div>
                )}
            </div>
        );
    }
}

export default UpdateLibro;
