# Y LIST

## DESCRIPTION

A lightweight [Node.js](https://nodejs.org/) package that memorizes past computations when providing the same functions as in previous calls.
Or any javascript agent.

### INSTALL

```
npm i ylist
```

###  USE
```
import List from "ylist";

const animals = List([new Dog, new Cat, new Duck]);
const animals.filter... 
```


## FUTURE


* Creates immutable lists from existing arrays or other iterable objects.
* Supports common list manipulation methods such as [concat](https://tc39.es/ecma262/#sec-array.prototype.concat), [filter](https://tc39.es/ecma262/#sec-array.prototype.filter), [find](https://tc39.es/ecma262/#sec-array.prototype.find) etc.
* All operations return new instances of the list, preserving immutability.
* Memorizes past computations when providing the same functions as in previous calls.
* Uses weak reference memoization.
* Employs B-tree-like optimization for memoization in cases of concat or slice operations on previous computations.
* Utilizes a proxy over [Array](https://tc39.es/ecma262/#sec-array-constructor), hence the behavior is similar to [Array](https://tc39.es/ecma262/#sec-array-constructor).

### Example

```
const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const testList = List(testArray);
const lt10 = (value) => value < 10;
const gt10 = (value) => value > 10;
testList.filter(lt10) === testList // true
testList.concat(testArray) === testList.concat(testArray) // true
testList.concat(testArray).slice(testArray.length) === testList // true

testList.filter(gt10) === List([]) // true

var ge5 = (value) => value >= 5;
testList.filter(ge5) === testList.filter((value) => value >= 5) // false
testList.filter(ge5) === testList.filter(ge5) // true
testList.toReversed().toReversed() === testList // true

testList.push // undefined
testList.shift // undefined
testList.pop // undefined
testList.unshift // undefined
testList.slice // undefined
testList.splice // undefined
testList.sort // undefined
testList.reverse // undefined

List([]) === List.empty // true

```

#### Warning:
* It is not recommended to use this package if function references constantly change. In such cases, caching does not work effectively. Therefore, weak reference memoization might not behave as expected.

* If function references are constantly changing, it is recommended to use the general method [Object.freeze](https://tc39.es/ecma262/#sec-object.freeze) or create/apply another [Proxy](https://tc39.es/ecma262/#sec-proxy-constructor) wrapper.
* All methods are implemented using [Array](https://tc39.es/ecma262/#sec-array-exotic-objects) [prototypes](https://tc39.es/ecma262/#sec-array.prototype). If any of the methods do not work, please pay attention to your ES version. Otherwise, install polyfills.

##### Benefits of Usage Illustrated with an Example.


Array benchmark (small is better)
| method                  | slow                  | avg                    | best                   | total               |
| ----------------------- | --------------------- | ---------------------- | ---------------------- | ------------------- |
| (is:0)    find          | 0.013146013021469116  | 0.00012582829977599442 | 0.00011199712753295898 | 0.22619247436523438 |
| (is:0)    findLast      | 0.24636802077293396   | 0.08995326521293436    | 0.08812400698661804    | 95.64512541890144   |
| (is:0)    findIndex     | 0.021925002336502075  | 0.00013207708415106492 | 0.00012299418449401855 | 0.25381630659103394 |
| (is:0)    findLastIndex | 0.5638859868049622    | 0.0867885997980331     | 0.08553600311279297    | 92.93515482544899   |
| (is:0)    filter        | 0.26325398683547974   | 0.09665332985718686    | 0.09577301144599915    | 101.15064090490341  |
| (is:0)    some          | 0.0032570064067840576 | 0.00013028696075732926 | 0.00011998414993286133 | 0.23662486672401428 |
| (is:0)    every         | 0.007956981658935547  | 0.0001333375170341599  | 0.00012299418449401855 | 0.2323017120361328  |
| (is:4999) find          | 0.11581200361251831   | 0.05337818045839135    | 0.04415199160575867    | 46.895296186208725  |
| (is:4999) findLast      | 0.1359269917011261    | 0.0513399853387715     | 0.04415100812911987    | 45.01649284362793   |
| (is:4999) findIndex     | 0.08764299750328064   | 0.0432878256681294     | 0.04287302494049072    | 44.467748790979385  |
| (is:4999) findLastIndex | 0.110850989818573     | 0.04340059599683292    | 0.04287999868392944    | 44.57445400953293   |
| (is:4999) filter        | 0.19745299220085144   | 0.09615995021133064    | 0.09583300352096558    | 97.42268002033234   |
| (is:4999) some          | 0.1129859983921051    | 0.04787135333289496    | 0.044150978326797485   | 44.75313124060631   |
| (is:4999) every         | 0.0016939938068389893 | 0.00020958214181857044 | 0.00011998414993286133 | 0.14904281497001648 |
| (is:9999) find          | 0.23492899537086487   | 0.09241079233624763    | 0.08808398246765137    | 94.7162943482399    |
| (is:9999) findLast      | 0.0028229951858520508 | 0.00018165541505818159 | 0.0001310110092163086  | 0.17870557308197021 |
| (is:9999) findIndex     | 0.30890199542045593   | 0.08620258700498284    | 0.08553999662399292    | 89.49158081412315   |
| (is:9999) findLastIndex | 0.0031360089778900146 | 0.00020201551575513242 | 0.0001240074634552002  | 0.1701372265815735  |
| (is:9999) filter        | 0.28716301918029785   | 0.11365661623394648    | 0.09580400586128235    | 98.28035670518875   |
| (is:9999) some          | 0.22939500212669373   | 0.10155332909779496    | 0.088142991065979      | 90.43184334039688   |
| (is:9999) every         | 0.016414999961853027  | 0.00019541470700641732 | 0.00011998414993286133 | 0.1861596703529358  |

List benchmark (small is better)
| method                  | slow                  | avg                    | best                   | total               |
| ----------------------- | --------------------- | ---------------------- | ---------------------- | ------------------- |
| (is:0)    find          | 0.04578500986099243   | 0.00019926726200930744 | 0.00018298625946044922 | 0.3711164891719818  |
| (is:0)    findLast      | 0.43387100100517273   | 0.00021054504097242627 | 0.00019299983978271484 | 0.7773020267486572  |
| (is:0)    findIndex     | 0.018757998943328857  | 0.00017074912567650066 | 0.00016698241233825684 | 0.2268763780593872  |
| (is:0)    findLastIndex | 0.0026049911975860596 | 0.00017361497197792452 | 0.00016200542449951172 | 0.24420121312141418 |
| (is:0)    filter        | 0.060264021158218384  | 0.00017865018608556046 | 0.00016000866889953613 | 0.3104492723941803  |
| (is:0)    some          | 0.012078016996383667  | 0.0002047760573348015  | 0.0001850128173828125  | 0.2800108790397644  |
| (is:0)    every         | 0.010136991739273071  | 0.00022196482849220475 | 0.0002110004425048828  | 0.3413539528846741  |
| (is:4999) find          | 0.05303400754928589   | 0.00017745729679980918 | 0.00016799569129943848 | 0.3179231286048889  |
| (is:4999) findLast      | 0.1433829963207245    | 0.00018209477287165784 | 0.0001710057258605957  | 0.43011197447776794 |
| (is:4999) findIndex     | 0.013437986373901367  | 0.00015700827902576054 | 0.00015100836753845215 | 0.23018282651901245 |
| (is:4999) findLastIndex | 0.000514984130859375  | 0.00015939170131266822 | 0.00014898180961608887 | 0.21402081847190857 |
| (is:4999) filter        | 0.024091005325317383  | 0.0001544858368499715  | 0.00014200806617736816 | 0.2368161976337433  |
| (is:4999) some          | 0.0008890032768249512 | 0.00017338552538655473 | 0.00016000866889953613 | 0.23946571350097656 |
| (is:4999) every         | 0.0010719895362854004 | 0.00020495555107628114 | 0.00014698505401611328 | 0.27923691272735596 |
| (is:9999) find          | 0.08872401714324951   | 0.07360692378056707    | 0.07318398356437683    | 76.7261433005333    |
| (is:9999) findLast      | 0.1714160144329071    | 0.000550392242496034   | 0.00016999244689941406 | 0.5755237936973572  |
| (is:9999) findIndex     | 0.000496983528137207  | 0.07593817097672888    | 0.07504600286483765    | 78.89414730668068   |
| (is:9999) findLastIndex | 0.07692000269889832   | 0.0005592977923345066  | 0.00032898783683776855 | 0.6342817842960358  |
| (is:9999) filter        | 0.34512999653816223   | 0.07723275818212744    | 0.07616299390792847    | 80.88212183117867   |
| (is:9999) some          | 0.2513199746608734    | 0.0727806533745375     | 0.07082900404930115    | 75.91782841086388   |
| (is:9999) every         | 0.7847490012645721    | 0.0004673107686380167  | 0.0742499828338623     | 81.65851283073425   |

----

|name| time ms (array time - list time) |
|--------------|------------------------|
| average diff |  0.04288869194819794   |
|  total diff  |   980.8674493432045    |
|  slow diff   | 0.0011970102787017822  |
|  best diff   |   0.0956220030784607   |
---

However, there is also a downside to using different references.
List benchmark (small is better)
| method                  | slow                  | avg                    | best                   | total               |
| ----------------------- | --------------------- | ---------------------- | ---------------------- | ------------------- |
| (is:0)    find          | 0.017932981252670288 | 0.0008189397542704353 | 0.00018700957298278809 | 0.4456775486469269 |
| (is:0)    findLast      | 0.47867098450660706  | 0.11180581547549087   | 0.0858440101146698     | 95.03021365404129  |
| (is:0)    findIndex     | 0.29715999960899353  | 0.0011408011963341203 | 0.00018399953842163086 | 0.7334803640842438 |
| (is:0)    findLastIndex | 0.7401839792728424   | 0.11328831263801993   | 0.08577001094818115    | 95.64228889346123  |
| (is:0)    filter        | 1.9352980256080627   | 0.13475315152105077   | 0.10406500101089478    | 116.73099943995476 |
| (is:0)    some          | 0.04808899760246277  | 0.000967048437389102  | 0.00020700693130493164 | 0.5676142573356628 |
| (is:0)    every         | 1.0563759803771973   | 0.13623522024433876   | 0.10397198796272278    | 116.48176655173302 |
| (is:4999) find          | 0.10088899731636047  | 0.03734477910933264   | 0.0368179976940155     | 37.91008344292641  |
| (is:4999) findLast      | 0.15418300032615662  | 0.04472632322244856   | 0.04322999715805054    | 44.903518319129944 |
| (is:4999) findIndex     | 0.08876699209213257  | 0.040836217241857264  | 0.0377810001373291     | 38.929931938648224 |
| (is:4999) findLastIndex | 0.0985029935836792   | 0.044396556927625105  | 0.043252021074295044   | 44.22883030772209  |
| (is:4999) filter        | 0.7337439954280853   | 0.09294671959135986   | 0.09008598327636719    | 93.83211103081703  |
| (is:4999) some          | 0.0854330062866211   | 0.03649339660024642   | 0.03571498394012451    | 38.39343759417534  |
| (is:4999) every         | 1.7619860172271729   | 0.09362696891645275   | 0.0897970199584961     | 94.82973054051399  |
| (is:9999) find          | 0.2361150085926056   | 0.07360692378056707   | 0.07318398356437683    | 76.7261433005333   |
| (is:9999) findLast      | 0.02373400330543518  | 0.000550392242496034  | 0.000299990177154541   | 0.5755237936973572 |
| (is:9999) findIndex     | 0.23989200592041016  | 0.07593817097672888   | 0.07504600286483765    | 78.89414730668068  |
| (is:9999) findLastIndex | 0.07692000269889832  | 0.0005592977923345066 | 0.00032898783683776855 | 0.6342817842960358 |
| (is:9999) filter        | 0.34512999653816223  | 0.07723275818212744   | 0.07616299390792847    | 80.88212183117867  |
| (is:9999) some          | 0.2513199746608734   | 0.0727806533745375    | 0.07082900404930115    | 75.91782841086388  |
| (is:9999) every         | 0.7847490012645721   | 0.09259174982566319   | 0.0742499828338623     | 81.65851283073425  |




|name| time ms (array time - list time) |
| ------------ | ---------------------- |
| average diff | -0.034354674276938134  |
| total   diff | -226.53446304798126    |
| slow    diff | -0.0162389874458313    |
| best    diff | -0.0082319974899292    |

For your own testing, you can review the `benchmark.js` file located in the library folder.

##### Other
- The library contains several functions for memoization. You can apply them if necessary.
```
import { memoize } from "ylist";
```

```
import { memoizeWeak } from "ylist"
```
