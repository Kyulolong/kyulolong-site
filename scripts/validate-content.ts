/**
 * 빌드 전에 콘텐츠를 검증한다. 실패하면 next build 로 넘어가지 않는다.
 *
 * 페이지가 아직 없어도 검증이 돌아야 하므로 build 스크립트에 직접 물려둔다.
 * (페이지가 생기면 렌더 과정에서도 같은 검증이 다시 걸린다)
 */
import { ContentError, getServices, getVideos, validateContent } from "../lib/content";

try {
  validateContent();
  const services = getServices();
  const videos = getVideos();
  const links = services.reduce((n, s) => n + s.relatedVideos.length, 0);

  console.log(
    `✓ 콘텐츠 검증 통과 — 서비스 ${services.length}개, 영상 ${videos.length}개, 양방향 연결 ${links}쌍`,
  );
} catch (error) {
  if (error instanceof ContentError) {
    console.error(`\n✗ ${error.message}`);
    process.exit(1);
  }
  throw error;
}
