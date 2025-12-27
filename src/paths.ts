const paths = {
  home() {
    return '/'
  },
  topicShow(topicSlug: string) {
    return `/topics/${topicSlug}`

  },
  postCreate(topicSlug: string) {
    return `/topics/${topicSlug}/posts/new`

  },
  postShow(topicSlug: string, postId: string) {
    return `/topics/${topicSlug}/posts/${postId}`

  },
  userProfile(userId: string) {
    return `/users/${userId}`

  },
  authSignIn() {
    return '/auth/signin'

  },
  authRegister() {
    return '/auth/register'

  },
  authVerify(token: string) {
    return `/auth/verify?token=${token}`

  },
}

export default paths