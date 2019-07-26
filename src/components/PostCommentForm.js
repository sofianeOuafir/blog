import React, { Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";

import { addPostComment } from "./../actions/comments";

class PostCommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: (props.comment && props.comment.text) || ""
    };
  }

  onTextChange = e => {
    const text = e.target.value;
    this.setState(() => ({ text }));
  };

  onSubmit = e => {
    e.preventDefault();
    const { postId, addPostComment, uid, userName, userPhotoURL } = this.props;
    const comment = {
      userPhotoURL,
      uid,
      userName,
      text: this.state.text,
      createdAt: moment()
    };
    addPostComment({ postId, comment });
    this.setState(() => ({ text: "" }));
  };

  render() {
    const { uid } = this.props;
    const authenticatedUser = !!uid;
    return (
      <Fragment>
        <form id="form" className="form" onSubmit={this.onSubmit}>
          <div className="form__input-container">
            <textarea
              placeholder={
                authenticatedUser
                  ? "Write a comment here"
                  : "Please log in to Stravell for leaving a comment"
              }
              className="textarea"
              type="text"
              onChange={this.onTextChange}
              value={this.state.text}
              disabled={!authenticatedUser}
            />
          </div>
          <button disabled={!authenticatedUser} className="button">
            Submit
          </button>
        </form>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  uid: auth.uid,
  userName: auth.userName,
  userPhotoURL: auth.userPhotoURL
});

const mapDispatchToProps = dispatch => ({
  addPostComment: ({ postId, comment }) => {
    dispatch(addPostComment({ postId, comment }));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostCommentForm);
