# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - heading "Connexion" [level=1] [ref=e3]
    - generic [ref=e4]:
      - textbox "Email" [ref=e5]: admin@test.com
      - textbox "Mot de passe" [ref=e6]: test123
      - button "Se connecter" [active] [ref=e7]
  - alert [ref=e8]
  - generic [ref=e11] [cursor=pointer]:
    - img [ref=e12] [cursor=pointer]
    - generic [ref=e16] [cursor=pointer]: 1 error
    - button "Hide Errors" [ref=e17] [cursor=pointer]:
      - img [ref=e18] [cursor=pointer]
```