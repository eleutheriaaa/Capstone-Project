import RegisterPage from '../pages/auths/register/register-page';
import LoginPage from '../pages/auths/login/login-page';
import HomePage from '../pages/home/home-page';
import BookmarkPage from '../pages/bookmark/bookmark-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
import AddPage from '../pages/add/add-page';
import NotFoundPage from '../pages/not-found/not-found-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new': () => checkAuthenticatedRoute(new AddPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
  '*': () => new NotFoundPage(),
};
