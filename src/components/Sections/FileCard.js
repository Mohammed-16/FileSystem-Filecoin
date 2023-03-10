import React, { useState, useEffect, useRef } from 'react';
import { IconButton, List, ListItem,ListItemIcon, ListItemText, ListItemSecondaryAction, Popper, ClickAwayListener, Grow, Paper } from '@material-ui/core';
import { Delete, GetApp, Info, InsertDriveFile, MoreVert, PersonAdd, Restore } from '@material-ui/icons';
import { convertBytes } from '../helpers';
import moment from 'moment';
import '../App.css';
import Swal from 'sweetalert2';

function FileCard(props) {
  const { star, unstar, deleteFile, restoreFile, section } = props;
  const { fileName, fileDescription, fileHash, fileId, fileType, fileSize, uploadTime, starred, uploader } = props.file;

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleDownload = () => {
    // sL(true);
      fetch('https://ipfs.infura.io/ipfs/' + fileHash, {
      method: 'GET',
      headers: {
        'Content-Type': fileType,
      },
    })
    .then((response) => response.blob())
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(
        new Blob([blob]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        fileName,
      );

      // Append to html link element page
      document.body.appendChild(link);

      // sL(false);
      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode.removeChild(link);
    });
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  }

  const handleShowDetails = () => {
    handleToggle();
    Swal.fire({
      allowOutsideClick: false,
      allowEscapeKey: false,
      title: 'Details',
      html: 
      `<h4><b>File Name:</b> ${fileName}</h4>`
      +`<h4><b>Description:</b> ${fileDescription}</h4>`
      +`<h4><b>File Type:</b> ${fileType}</h4>`
      +`<h4><b>File Size:</b> ${convertBytes(fileSize)}</h4>`
      +`<h4><b>Upload Time:</b> ${moment.unix(uploadTime).format('h:mm:ss A M/D/Y')}</h4>`
      +`<h4><b>Uploaded By</b> ${uploader}</h4>`
      ,
      confirmButtonText: 'Okay',
      icon: 'info',
      backdrop: false,
      customClass: {
        container: 'my-swal'
      }
    })
  }


  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className='fileCard'>
      <a className="fileCard--top" href={`https://ipfs.infura.io/ipfs/${fileHash}`} target="_blank" rel="noopener noreferrer" >
        <InsertDriveFile color="error" style={{fontSize:130,opacity:0.7}} />
      </a>
      <div className="fileCard--bottom">
        <List>
          <ListItem>
            <ListItemText secondary={fileDescription} style={{cursor: 'default' , color:'error'}} />
            <ListItemSecondaryAction>
              <IconButton edge="end" style={{border:'none',outline:'none'}}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <MoreVert />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>      
        </List>
      </div>

      <div>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <List>
                    <ListItem button onClick={() => handleShowDetails()}>
                      <ListItemIcon>
                        <Info />
                      </ListItemIcon>
                      <ListItemText primary="Details" />
                    </ListItem>
                    {/* <ListItem button>
                      <ListItemIcon>
                        <Visibility />
                      </ListItemIcon>
                      <ListItemText primary="View" />
                    </ListItem> */}
                    {
                      section !== 'Trash' &&
                      <>
                        <ListItem button onClick={() => handleDownload()}>
                          <ListItemIcon>
                            <GetApp />
                          </ListItemIcon>
                          <ListItemText primary="Download" />
                        </ListItem>
                        <ListItem button
                          onClick={() => {
                            starred ? unstar(fileId, fileHash)
                            : star(fileId, fileHash)
                          }}
                        >
                          <ListItemIcon>
                            <PersonAdd />
                          </ListItemIcon>
                          <ListItemText primary="Star" />
                        </ListItem>
                      </>
                    }
                    {
                      section === 'Trash' &&
                      <>
                        <ListItem button
                          onClick={() => restoreFile(fileId, fileHash)}
                        >
                          <ListItemIcon>
                            <Restore />
                          </ListItemIcon>
                          <ListItemText primary="Restore" />
                        </ListItem>
                      </>  
                    }
                    <ListItem button
                      onClick={() => deleteFile(fileId, fileHash)}
                    >
                      <ListItemIcon>
                        <Delete />
                      </ListItemIcon>
                      <ListItemText primary="Delete" />
                    </ListItem>
                  </List>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>

    </div>
  )
}

export default FileCard;
