import React, { Component } from 'react';
import NotefulForm from '../NotefulForm/NotefulForm';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css';
import ValidationError from '../ValidationError';


export default class AddNote extends Component {
  static defaultProps = {
    history: {
      push: () => { }
    },
  }
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      newNoteName: '',
      newNoteContent: '',
      noteFolder: '',
      newNoteNameValid: false,
      newNoteContentValid: false,
      noteFolderValid: false,
      noteFormValid: false,
      validationMessages: {
        newNoteName: '',
        newNoteContent: '',
        noteFolder: ''
      }
    }
  }

  updateNoteName(newNoteName) {
    this.setState({newNoteName}, () => {this.validateNewNoteName(newNoteName)});
  }

  updateNoteContent(newNoteContent) {
    this.setState({newNoteContent}, () => {this.validateNewNoteContent(newNoteContent)});
  }

  updateNoteFolder (noteFolder) {
    this.setState({noteFolder}, () => {this.validateNoteFolder(noteFolder)});
  }

  validateNewNoteName(fieldValue) {
    
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;

    fieldValue = fieldValue.trim();
    if(fieldValue.length === 0) {
      fieldErrors.newNoteName = 'Name is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.newNoteName = 'Name must be at least 3 characters long';
        hasError = true;
      } else {
         fieldErrors.newNoteName = '';
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
      fieldErrors.newNoteContent = 'Content is required';
      hasError = true;
    } else {
      if (fieldValue.length < 3) {
        fieldErrors.newNoteContent = 'Content must be at least 3 characters long';
        hasError = true;
      } else {
         fieldErrors.newNoteContent = '';
         hasError = false;
        }
      }
    

    this.setState({
      validationMessages: fieldErrors,
      newNoteContentValid: !hasError
    }, this.noteFormValid );
    
    

  }

  validateNoteFolder(option) {
    const fieldErrors = {...this.state.validationMessages};
    let hasError = false;
    
    

    if(option.length === 0) {
      fieldErrors.noteFolder = 'Please select a folder';
      hasError = true;
    } else {
      fieldErrors.noteFolder = '';
      hasError = false;
     }
  

    this.setState({
      validationMessages: fieldErrors,
      noteFolderValid: !hasError
    }, this.noteFormValid );
  

  }

  noteFormValid() {
    this.setState({
      noteFormValid: this.state.newNoteNameValid && this.state.newNoteContentValid && this.state.noteFolderValid
    });
  }

  

  handleSubmit = e => {
    e.preventDefault()
    const newNote = {
      name: e.target['note-name'].value,
      content: e.target['note-content'].value,
      folderId: e.target['note-folder-id'].value,
      modified: new Date(),
    }
    fetch(`${config.API_ENDPOINT}/notes`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(newNote),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then(note => {
        this.context.addNote(note)
        this.props.history.push(`/folder/${note.folderId}`)
      })
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const { folders=[] } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={this.handleSubmit}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' name='note-name' onChange={e => this.updateNoteName(e.target.value)}/>
            <ValidationError hasError={!this.state.newNoteNameValid} message={this.state.validationMessages.newNoteName} />
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input' name='note-content' onChange={e => this.updateNoteContent(e.target.value)} />
            <ValidationError hasError={!this.state.newNoteContentValid} message={this.state.validationMessages.newNoteContent}/>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select' name='note-folder-id' required onChange={e => this.updateNoteFolder(e.target.value)}>
            
              <option value=''>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            <ValidationError hasError={!this.state.noteFolderValid} message={this.state.validationMessages.noteFolder}/>
          </div>
          <div className='buttons'>
            <button type='submit' disabled={!this.state.noteFormValid}>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
  
}