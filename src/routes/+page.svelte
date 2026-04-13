<script lang="ts">
  import { onMount } from 'svelte';
  import { SiSpotify } from "@icons-pack/svelte-simple-icons";

  let nowPlaying = $state<any>(null);
  const pfView = false; // 프로필 정보 관련 변수

  async function getNowPlaying() {
    const res = await fetch('/api/now-playing');
    const data = await res.json();
    // console.log("받아온 곡 데이터:", data); // Spotify API에서 받아온 json을 콘솔에 뿌려줌.
    nowPlaying = data;
  }

  onMount(() => {
    getNowPlaying();
    const apiinterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            getNowPlaying();
        }
    }, 10000);

    const uiInterval = setInterval(() => {
        if (nowPlaying && nowPlaying.is_playing) {
            nowPlaying.progress_ms += 1000;

            if (nowPlaying.progress_ms > nowPlaying.item.duration_ms) {
                nowPlaying.progress_ms = nowPlaying.item.duration_ms;
            }
        }
    }, 1000);
    return () => {
        clearInterval(apiinterval);
        clearInterval(uiInterval);
    };
  });
</script>

{#if pfView}
    <div>
          <img class="avatar" src="https://avatars.githubusercontent.com/u/71020988?v=4" alt="?" />
          <h2>y^7x</h2>
          <p class="txt-secondary">설명</p>
    </div>
{/if}

<div class="main-container">
    <h3 style="padding: 8px 13px;">현재 듣는 곡</h3>
    {#if nowPlaying}
        {#if nowPlaying.is_playing}
            <div class="now-playing-container">
                <img 
                src={nowPlaying.item.album.images[0].url} 
                alt={nowPlaying.item.name} 
                class="now-playing-cover"
                />
                <div class="now-playing-info">
                    <div class="now-playing-txts">
                        <h4>
                            <a href={nowPlaying.item.album.external_urls.spotify} target="_blank" rel="noopener noreferrer nofollow">{nowPlaying.item.name}</a>
                        </h4>
                        <p class="txt-secondary">
                            {nowPlaying.item.artists.map((a: any) => a.name).join(', ')}
                        </p>
                    </div>
                    
                    <div class="now-playing-progress-frame">
                        <div class="progress-bg">
                        <div 
                            class="progress-bar" 
                            style="width: {(nowPlaying.progress_ms / nowPlaying.item.duration_ms) * 100}%"
                        ></div>
                        </div>
                        <div class="now-playing-progress-mstxt">
                            <span class="txt-secondary-sub">
                                {Math.floor(nowPlaying.progress_ms / 1000 / 60)}:{String(Math.floor((nowPlaying.progress_ms / 1000) % 60)).padStart(2, '0')} 
                            </span>
                            <SiSpotify class="si-s" />
                            <!-- <div style="display: flex; flex-direction: row; gap: 6px;">
                                <SiSpotify class="si-s" />
                                <span class="txt-primary-sub">Spotify에서 듣는 중</span>
                            </div> -->
                            <span class="txt-secondary-sub">
                                {Math.floor(nowPlaying.item.duration_ms / 1000 / 60)}:{String(Math.floor((nowPlaying.item.duration_ms / 1000) % 60)).padStart(2, '0')} 
                            </span>
                        </div>
                    </div>
                    <!-- <span class="txt-secondary-sub">Spotify에서 듣는 중</span> -->
                </div>
            </div>
        {:else}
        <p class="txt-secondary-sub">지금은 노래를 듣고 있지 않아요.</p>
    {/if}
    {:else}
    <p>데이터 불러오는 중...</p>
    {/if}
</div>
