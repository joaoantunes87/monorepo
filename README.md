```bash
yarn
cd packages/mobile
npx pod-install ios
yarn ios
```

Should the application weel with a list of books.

Go to `packages/mobile/index.js` uncomment line 4:
import 'react-native-gesture-handler';

Reload metro bundler and start having the following errors in infinite loop:

```bash
[Mon Dec 28 2020 11:59:42.830]  ERROR    Invariant Violation: No callback found with cbID 18929 and callID 9464 for module <unknown>. Args: '[1131]'
[Mon Dec 28 2020 11:59:42.873]  ERROR    Invariant Violation: No callback found with cbID 18945 and callID 9472 for module <unknown>. Args: '[1132]'
[Mon Dec 28 2020 11:59:42.898]  ERROR    Invariant Violation: No callback found with cbID 18961 and callID 9480 for module <unknown>. Args: '[1133]'
[Mon Dec 28 2020 11:59:42.900]  ERROR    Invariant Violation: No callback found with cbID 18979 and callID 9489 for module <unknown>. Args: '[1134]'
[Mon Dec 28 2020 11:59:42.916]  ERROR    Invariant Violation: No callback found with cbID 18995 and callID 9497 for module <unknown>. Args: '[1135]'
[Mon Dec 28 2020 11:59:42.936]  ERROR    Invariant Violation: No callback found with cbID 19011 and callID 9505 for module <unknown>. Args: '[1136]'
[Mon Dec 28 2020 11:59:42.998]  ERROR    Invariant Violation: No callback found with cbID 19029 and callID 9514 for module <unknown>. Args: '[1137]'
[Mon Dec 28 2020 11:59:43.270]  ERROR    Invariant Violation: No callback found with cbID 19045 and callID 9522 for module <unknown>. Args: '[1138]'
[Mon Dec 28 2020 11:59:43.600]  ERROR    Invariant Violation: No callback found with cbID 19061 and callID 9530 for module <unknown>. Args: '[1139]'
[Mon Dec 28 2020 11:59:43.920]  ERROR    Invariant Violation: No callback found with cbID 19079 and callID 9539 for module <unknown>. Args: '[1140]'
[Mon Dec 28 2020 11:59:43.135]  ERROR    Invariant Violation: No callback found with cbID 19095 and callID 9547 for module <unknown>. Args: '[1141]'
[Mon Dec 28 2020 11:59:43.168]  ERROR    Invariant Violation: No callback found with cbID 19111 and callID 9555 for module <unknown>. Args: '[1142]'
[Mon Dec 28 2020 11:59:43.209]  ERROR    Invariant Violation: No callback found with cbID 19129 and callID 9564 for module <unknown>. Args: '[1143]'
[Mon Dec 28 2020 11:59:43.235]  ERROR    Invariant Violation: No callback found with cbID 19145 and callID 9572 for module <unknown>. Args: '[1144]'
[Mon Dec 28 2020 11:59:43.271]  ERROR    Invariant Violation: No callback found with cbID 19161 and callID 9580 for module <unknown>. Args: '[1145]'
[Mon Dec 28 2020 11:59:43.299]  ERROR    Invariant Violation: No callback found with cbID 19179 and callID 9589 for module <unknown>. Args: '[1146]'
[Mon Dec 28 2020 11:59:43.337]  ERROR    Invariant Violation: No callback found with cbID 19195 and callID 9597 for module <unknown>. Args: '[1147]'
[Mon Dec 28 2020 11:59:43.370]  ERROR    Invariant Violation: No callback found with cbID 19211 and callID 9605 for module <unknown>. Args: '[1148]'
[Mon Dec 28 2020 11:59:43.403]  ERROR    Invariant Violation: No callback found with cbID 19229 and callID 9614 for module <unknown>. Args: '[1149]'
[Mon Dec 28 2020 11:59:43.429]  ERROR    Invariant Violation: No callback found with cbID 19245 and callID 9622 for module <unknown>. Args: '[1150]'
[Mon Dec 28 2020 11:59:43.456]  ERROR    Invariant Violation: No callback found with cbID 19261 and callID 9630 for module <unknown>. Args: '[1151]'
[Mon Dec 28 2020 11:59:43.502]  ERROR    Invariant Violation: No callback found with cbID 19279 and callID 9639 for module <unknown>. Args: '[1152]'
```
