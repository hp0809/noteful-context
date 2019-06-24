import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import ApiContext from '../ApiContext'
import config from '../config'
import './App.css'
import ValidationError from '../ValidationError'

class App extends Component {
    state = {
        notes: [],
        folders: [],
        newNoteName: '',
        newNoteContent: '',
        newNoteFolder: '',
        folderName:'',
        newNoteNameValid: false,
        newNoteContentValid: false,
        newNoteFolderValid: false,
        folderNameValid: false,
        validationMessages: {
          noteName: '',
          noteContent: '',
          folderName: ''
        }
    };

    componentDidMount() {
        Promise.all([
            fetch(`${config.API_ENDPOINT}/notes`),
            fetch(`${config.API_ENDPOINT}/folders`)
          ])
            .then(([notesRes, foldersRes]) => {
              if (!notesRes.ok)
                return notesRes.json().then(e => Promise.reject(e))
              if (!foldersRes.ok)
                return foldersRes.json().then(e => Promise.reject(e))
      
              return Promise.all([
                notesRes.json(),
                foldersRes.json(),
              ])
            })
            .then(([notes, folders]) => {
              this.setState({ notes, folders })
            })
            .catch(error => {
              console.error({ error })
            })
        }
      
        handleAddFolder = folder => {
          this.setState({
            folders: [
              ...this.state.folders,
              folder
            ]
          })
        }
      
        handleAddNote = note => {
          this.setState({
            notes: [
              ...this.state.notes,
              note
            ]
          })
        }
      
        handleDeleteNote = noteId => {
          this.setState({
            notes: this.state.notes.filter(note => note.id !== noteId)
          })
        }

        updateFolder(folderName) {
          this.setState({folderName}, () => {this.validateFolderName(folderName)});
        }

        updateNoteName(newNoteName) {
          this.setState({newNoteName}, () => {this.validateNewNoteName(newNoteName)});
        }

        updateNoteContent(newNoteContent) {
          this.setState({newNoteContent}, () => {this.validateNewNoteName(newNoteContent)});
        }

        validateFolderName(fieldValue) {
          const fieldErrors = {...this.state.validationMessages};
          let hasError = false;
      
          fieldValue = fieldValue.trim();
          if(fieldValue.length === 0) {
            fieldErrors.folderName = 'Name is required';
            hasError = true;
          } else {
            if (fieldValue.length < 3) {
              fieldErrors.folderName = 'Name must be at least 3 characters long';
              hasError = true;
            } else {
              fieldErrors.folderName = '';
              hasError = false;
            }
          }
      
          this.setState({
            validationMessages: fieldErrors,
            folderNameValid: !hasError
          }, this.folderFormValid );
      
        }
      
        validateNewNoteName(fieldValue) {
          const fieldErrors = {...this.state.validationMessages};
          let hasError = false;
      
          fieldValue = fieldValue.trim();
          if(fieldValue.length === 0) {
            fieldErrors.noteName = 'Name is required';
            hasError = true;
          } else {
            if (fieldValue.length < 3) {
              fieldErrors.noteName = 'Name must be at least 3 characters long';
              hasError = true;
            } else {
               fieldErrors.noteName = '';
               hasError = false;
              }
            }
          
      
          this.setState({
            validationMessages: fieldErrors,
            newNoteNameValid: !hasError
          }, this.noteFormValid );
      
        }
      
        validateNewNoteContent(fieldValue) {
          const fieldErrors = {...this.state.validationMessages};
          let hasError = false;
      
          fieldValue = fieldValue.trim();
          if(fieldValue.length === 0) {
            fieldErrors.noteContent = 'Content is required';
            hasError = true;
          } else {
            if (fieldValue.length < 3) {
              fieldErrors.noteContent = 'Content must be at least 3 characters long';
              hasError = true;
            } else {
               fieldErrors.password = '';
               hasError = false;
              }
            }
          
      
          this.setState({
            validationMessages: fieldErrors,
            passwordValid: !hasError
          }, this.noteFormValid );
      
        }
      
        noteFormValid() {
          this.setState({
            formValid: this.state.newNoteNameValid && this.state.newNoteContentValid 
          });
        }

        folderFormValid() {
          this.setState({
            formValid: this.state.folderNameValid
          });
        }
      
        renderNavRoutes() {
            return (
              <>
                {['/', '/folder/:folderId'].map(path =>
                  <Route
                    exact
                    key={path}
                    path={path}
                    component={NoteListNav}
                  />
                )}
                <Route
                  path='/note/:noteId'
                  component={NotePageNav}
                />
                <Route
                  path='/add-folder'
                  component={NotePageNav}
                />
                <Route
                  path='/add-note'
                  component={NotePageNav}
                />
              </>
            )
          }

          renderMainRoutes() {
            return (
              <>
                {['/', '/folder/:folderId'].map(path =>
                  <Route
                    exact
                    key={path}
                    path={path}
                    component={NoteListMain}
                  />
                )}
                <Route
                  path='/note/:noteId'
                  component={NotePageMain}
                />
                <Route
                  path='/add-folder'
                  component={AddFolder}
                />
                <Route
                  path='/add-note'
                  component={AddNote}
                />
              </>
            )
          }
          render() {
            const value = {
              notes: this.state.notes,
              folders: this.state.folders,
              addFolder: this.handleAddFolder,
              addNote: this.handleAddNote,
              deleteNote: this.handleDeleteNote,
            }
            return(
              <ApiContext.Provider value={value}>
                <div className='App'>
                  <nav className='App__nav'>
                    {this.renderNavRoutes()}
                  </nav>
                  <header className='App__header'>
                    <h1>
                      <Link to='/'>Noteful</Link>
                      {' '}
                      <FontAwesomeIcon icon='check-double' />
                    </h1>
                  </header>
                  <main className='App__main'>
                    {this.renderMainRoutes()}
                  </main>
                </div>
              </ApiContext.Provider>
            )
          }
        }
        export default App