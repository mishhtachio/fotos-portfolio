#include <iostream>
using namespace std;

bool isValid(int num) {
    while (num > 0) {
        if ((num % 10) % 2 == 0) return true;
        num /= 10;
    }
    return false
}

int main() {
    int q;
    cout << "Enter the number of queries: ";
    cin >> q;

    while (q--) {
        int k;
        cout << "Enter the value K: ";
        cin >> k;

        int count = 0;
        int L = -1, R = -1;

        for (int i = 1; i <= 100000; i++) {
            if (isValid(i)) {
                if (count == 0) L =i;
                count++;

                if (count == k) {
                    R = i;
                    break
                }
            }
        }

        if (R == -1) cout << "Output: -1\n";
        else cout << "Output: " << L << " " << R << endl;
    }

    return 0;
}