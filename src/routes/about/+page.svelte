<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import MainLayout from "$lib/components/MainLayout.svelte";

  import image from "$lib/assets/about.png";
  import norbie from "$lib/assets/norbie.webp";
</script>

<svelte:head>
  <title>About | Dave Lange</title>
</svelte:head>
<MainLayout>
  {#snippet sidebarSlot()}
    <Header />
  {/snippet}

  <div class="wrapper body">
    <article class="prose">
      <h1>Hello!</h1>
      <p>
        I'm a software developer. I'm passionate about turning ideas
        into meaningful tools and experiences. I focus on full-stack
        web products, and am always looking for ways to grow and
        refine my skills.
      </p>

      <figure class="about-image">
        <img
          src={image}
          alt="Me standing on a beach in Cornwall"
          title="Me standing on a beach in Cornwall"
        />
      </figure>

      <p>
        With a background in graphic design, I often work at the
        intersection of users' experience and the software that
        delivers it - balancing needs, expectations, and all the
        technical constraints and possibilities. It's often a messy
        place to work in, but I enjoy the challenge and immense
        potential it has.
      </p>

      <p>
        I've gained a lot of experience working in varied projects,
        both small and large, mostly with:
      </p>

      <ul>
        <li>
          Frontend development: Experienced with vanilla
          (HTML/CSS/JS), Typescript, React, Svelte, among others. I
          also work with Three.js and shaders. Also a keen eye for
          visual detail.
        </li>
        <li>
          Full stack projects: Mostly Node.js in serverless
          environments, as well as more traditional monolithic
          projects. I've also worked with Phoenix (Elixir). In another
          life I also worked with Wordpress/PHP.
        </li>
        <li>
          Web3: experience in building dApps (Ethereum and Starknet).
        </li>
      </ul>

      <p>
        Currently I'm working remotely at <a
          href="https://subvisual.com"
          target="_blank">Subvisual</a
        >, building all sorts of products. I also give some occasional
        talks at developer meetups, and help organise
        <a href="https://luma.com/k7hu86ln" target="_blank">
          Coimbra.js
        </a>, a community driven meetup. I enjoy mentoring and helping
        other developers grow.
      </p>

      <p>
        I live in Coimbra with my wife Priscila and our dog, <span
          class="norbie"
          >Norbie
          <img src={norbie} alt="Norbie" />
        </span>. When I'm not working, you might find me hiking in the
        mountains, where we enjoy getting lost in nature. That or
        enjoying some wine.
      </p>
    </article>
  </div>
</MainLayout>

<style>
  .body {
    max-width: 55ch;
    h1 {
      margin-top: 0;
    }

    @media (min-width: 768px) {
      margin-top: var(--36px);
    }
  }

  .about-image {
    z-index: 1;
    width: 220px;
    margin: var(--16px) auto;

    @media (min-width: 768px) {
      float: left;
      margin: 0 var(--24px) 0 -80px;
    }

    img {
      margin: 0;
      border-radius: var(--8px);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .norbie {
    position: relative;
    text-decoration: underline;
    text-decoration-style: dotted;
    display: inline-block;

    img {
      position: absolute;
      margin: 0;
      bottom: var(--24px);
      translate: -50% 0;
      max-width: 140px;
      transition: opacity 0.2s ease-in-out;
      display: none;
      animation: fadeIn 0.2s ease-in-out;
    }

    &:hover {
      img {
        display: block;
        animation: fadeIn 0.2s ease-in-out;
      }
    }
  }
</style>
