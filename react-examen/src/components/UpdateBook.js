import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import URL from '../common/Global';
import SimpleReactValidator from 'simple-react-validator';

class UpdateBook extends Component {
    constructor(props) {
        super(props);

        this.url = URL.API;
        this.ISBNRef = React.createRef();
        this.nombreLibroRef = React.createRef();
        this.autorRef = React.createRef();
        this.editorialRef = React.createRef();
        this.portadaRef = React.createRef();
        this.paginasRef = React.createRef();

        this.state = {
            libro: {
                ISBN: '',
                nombreLibro: '',
                autor: '',
                editorial: '',
                portada: null,
                paginas: 0,
            },
            status: null,
            force: false,
        };

        this.validator = new SimpleReactValidator({
            validators: {
                isbn: {
                    message: 'El ISBN debe tener el formato correcto en números (XXX-XXXXXXXXXX)',
                    rule: (val, params, validator) => /^[0-9]{3}-[0-9]{10}$/.test(val),
                },
            },
        });
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.getBookDetails();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getBookDetails = () => {
        const id = this.props.match.params.id;
        axios.get(`${this.url}/libro/id/${id}`)
            .then(res => {
                if (this._isMounted) {
                    console.log('Libro details:', res.data.libro);
                    this.setState(prevState => ({
                        libro: {
                            ...prevState.libro,
                            ...res.data.libro,
                        },
                    }), () => console.log('Updated state:', this.state.libro));
                }
            })
            .catch(err => {
                console.error('Error fetching libro details:', err);
                if (this._isMounted) {
                    this.setState({
                        libro: null,
                    });
                }
            });
    };

    updateBook = async (e) => {
        e.preventDefault();
        this.changeState();

        if (this.validator.allValid()) {
            try {
                const id = this.props.match.params.id;

                // Verificar si se ha cargado un nuevo archivo de imagen
                if (this.state.portada && this.state.portada.name) {
                    // Crear un objeto FormData y agregar el nuevo archivo
                    const formData = new FormData();
                    formData.append('file', this.state.portada, this.state.portada.name);

                    // Enviar el nuevo archivo de imagen al servidor
                    await axios.post(`${this.url}/libro/upload/${id}`, formData);
                }

                // Crear un objeto que contenga solo los datos del libro (sin la imagen existente)
                const libroData = {
                    ISBN: this.state.libro.ISBN,
                    nombreLibro: this.state.libro.nombreLibro,
                    autor: this.state.libro.autor,
                    editorial: this.state.libro.editorial,
                    paginas: this.state.libro.paginas,
                };

                // Enviar los datos del libro actualizados al servidor
                const res = await axios.put(`${this.url}/libro/${id}`, libroData);

                // Manejar la respuesta del servidor
                this.handleLibroUpdate(res);
            } catch (error) {
                console.error('Error updating libro:', error);
                this.setState({
                    status: 'error',
                });
            }
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'error',
            });
        }
    };

    handleLibroUpdate = (res) => {
        const { status } = res.data;
        if (this._isMounted) {
            if (status === 'success') {
                window.alert('Libro Actualizado');
                this.props.history.push('/');
            } else {
                this.setState({
                    status: 'error',
                });
            }
        }
    };

    changeState = () => {
        const getValueFromRef = (ref) => ref?.current?.value || '';

        this.setState({
            libro: {
                ISBN: getValueFromRef(this.ISBNRef),
                nombreLibro: getValueFromRef(this.nombreLibroRef),
                autor: getValueFromRef(this.autorRef),
                editorial: getValueFromRef(this.editorialRef),
                portada: this.state.libro.portada || null,
                paginas: parseInt(getValueFromRef(this.paginasRef), 10),
            },
        }, () => console.log('Changed state:', this.state.libro));
    };

    fileChange = (e) => {
        const file = e.target.files[0];
        this.setState({
            portada: file || null,
        });
    };

    render() {
        return (
            <div className='containerHtml'>
                <form onSubmit={this.updateBook}>
                    <table>
                        <tbody>
                            <tr>
                                <td>ISBN</td>
                                <td>
                                    <input type="text" name="ISBN" ref={this.ISBNRef} value={this.state.libro.ISBN} onChange={this.changeState} maxLength={14} />
                                    {this.validator.message('ISBN', this.state.libro.ISBN, 'required|isbn')}
                                </td>
                            </tr>
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
                                    <input className='btnFile' type="file" name="portada" ref={this.portadaRef} onChange={this.fileChange} />
                                </td>
                            </tr>
                            <tr>
                                <td>Páginas</td>
                                <td>
                                    <input
                                        type="number"
                                        name="paginas"
                                        ref={this.paginasRef}
                                        value={this.state.libro.paginas}
                                        onChange={this.changeState}
                                        min={1}
                                        step="1"
                                    />
                                    {this.validator.message('paginas', this.state.libro.paginas, 'required|numeric')}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                </td>
                                <td>
                                    <input className='btnActualizar' type="submit" value="Actualizar Libro" />

                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}

export default withRouter(UpdateBook);
